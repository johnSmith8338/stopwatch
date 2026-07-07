import { HttpClient } from '@angular/common/http';
import { DestroyRef, Directive, ElementRef, inject, Input, Renderer2, SimpleChanges } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, Observable, shareReplay, throwError } from 'rxjs';

@Directive({
  selector: '[iconName]',
})
export class SvgIcon {
  private static readonly svgTextCache = new Map<string, Observable<string>>();
  private static readonly svgTemplateCache = new Map<string, SVGElement>();

  private el = inject(ElementRef<HTMLElement>);
  private renderer = inject(Renderer2);
  private http = inject(HttpClient);
  private destroyRef = inject(DestroyRef);
  private readonly transientClasses = new Set(['spin']);
  private loadRequestId = 0;

  @Input() iconName!: string;
  @Input() iconColor?: string;
  @Input() ariaLabel?: string;

  static clearCacheForTesting(): void {
    this.svgTextCache.clear();
    this.svgTemplateCache.clear();
  }

  private static getSvgText(http: HttpClient, path: string): Observable<string> {
    const cached = this.svgTextCache.get(path);
    if (cached) return cached;

    const request = http.get(path, { responseType: 'text' }).pipe(
      catchError((error) => {
        this.svgTextCache.delete(path);
        this.svgTemplateCache.delete(path);
        return throwError(() => error);
      }),
      shareReplay({ bufferSize: 1, refCount: false }),
    );
    this.svgTextCache.set(path, request);
    return request;
  }

  private static getSvgTemplate(path: string, svgText: string): SVGElement {
    const cached = this.svgTemplateCache.get(path);
    if (cached) return cached;

    const parser = new DOMParser();
    const doc = parser.parseFromString(svgText, 'image/svg+xml');
    const svg = doc.documentElement as unknown as SVGElement;
    svg.removeAttribute('width');
    svg.removeAttribute('height');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('stroke', 'currentColor');
    svg.querySelectorAll('path').forEach((pathNode) => pathNode.setAttribute('stroke', 'currentColor'));

    this.svgTemplateCache.set(path, svg);
    return svg;
  }

  private clearHost() {
    const hostEl = this.el.nativeElement;
    while (hostEl.firstChild) {
      this.renderer.removeChild(hostEl, hostEl.firstChild);
    }
  }

  private applyA11yAttributes(host: HTMLElement) {
    const label = this.ariaLabel || this.iconName;
    this.renderer.setAttribute(host, 'role', 'img');
    this.renderer.setAttribute(host, 'aria-label', label);
  }

  private loadSvg() {
    const iconName = this.iconName;
    const requestId = ++this.loadRequestId;

    if (!iconName) {
      this.clearHost();
      return;
    }

    const path = `svg/${iconName}.svg`;

    SvgIcon.getSvgText(this.http, path).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: (svgText: string) => {
        if (requestId !== this.loadRequestId || this.iconName !== iconName) return;

        this.clearHost();

        const host = this.el.nativeElement;
        this.applyA11yAttributes(host);

        const svg = SvgIcon.getSvgTemplate(path, svgText).cloneNode(true) as SVGElement;

        if (this.iconColor) {
          svg.setAttribute('style', `color: var(--${this.iconColor});`);
        }

        const hostClasses = Array.from(host.classList as Iterable<string>)
          .filter((className) => !this.transientClasses.has(className));
        hostClasses.forEach((className) => this.renderer.addClass(svg, className));

        this.renderer.appendChild(host, svg);
      },
      error: err => {
        if (requestId !== this.loadRequestId || this.iconName !== iconName) return;
        console.error(`[SvgIconDirective]: не удалось загрузить ${path}`, err);
      },
    });
  }

  ngOnInit(): void {
    this.loadSvg();
  }

  ngOnChanges(changes: SimpleChanges): void {
    const shouldReload =
      (changes['iconName'] && !changes['iconName'].firstChange)
      || (changes['iconColor'] && !changes['iconColor'].firstChange)
      || (changes['ariaLabel'] && !changes['ariaLabel'].firstChange);

    if (shouldReload) {
      this.loadSvg();
    }
  }
}
