import { Injectable } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BreadcrumbService {
  private breadcrumbsSubject = new BehaviorSubject<Array<{ label: string, url: string }>>([]);
  breadcrumbs$ = this.breadcrumbsSubject.asObservable();

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      const currentUrl = this.router.url;
      this.updateBreadcrumbs(currentUrl);
    });
  }

  updateBreadcrumbs(url: string): void {
    let breadcrumbs = [];

    console.log('Current URL:', url);

    // Check for the home page or login page
    if (url === '/' || url === '/home' || url === '') {
        breadcrumbs.push({ label: 'Home', url: '/home' });
    } else if (url === '/login') {
        breadcrumbs.push({ label: 'Home', url: '/home' });
        breadcrumbs.push({ label: 'Login', url: '/login' });
    } else if (url.includes('product')) {
        breadcrumbs.push({ label: 'Home', url: '/home' });
        breadcrumbs.push({ label: 'Product', url: '/product' });
    } else if (url.includes('productDetails')) {
        breadcrumbs.push({ label: 'Home', url: '/home' });
        breadcrumbs.push({ label: 'Product', url: '/product' });
        breadcrumbs.push({ label: 'Item Summary', url: `/productDetails/${this.activatedRoute.snapshot.paramMap.get('vendorId')}` });
    }

    console.log('Breadcrumbs:', breadcrumbs);
    this.breadcrumbsSubject.next(breadcrumbs);
}
}