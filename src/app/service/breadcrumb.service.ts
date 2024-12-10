import { Injectable } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BreadcrumbService {
  private breadcrumbsSubject = new BehaviorSubject<Array<{ label: string, url: string }>>([]);
  breadcrumbs$ = this.breadcrumbsSubject.asObservable();

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
    // Listen to route changes and update breadcrumbs accordingly
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      // Get vendorId from the current route
      const vendorId = this.getVendorIdFromRoute();
      this.updateBreadcrumbs(vendorId); // Update breadcrumbs with the vendorId
    });
  }

  // Function to get the vendorId from the route
  private getVendorIdFromRoute(): number {
    const vendorId = this.activatedRoute.snapshot.paramMap.get('vendorId');
    return vendorId ? +vendorId : 0; // Return number or 0 if not found
  }

  // Update breadcrumbs with vendorId
  updateBreadcrumbs(vendorId: number): void {
    let breadcrumbs = [];
    const currentUrl = this.router.url;

    // Handle Home page
    if (currentUrl === '/' || currentUrl === '/home' || currentUrl === '') {
      breadcrumbs.push({ label: 'Home', url: '/home' });
    }

    // Handle Product page
    else if (currentUrl.includes('/product')) {
      breadcrumbs.push({ label: 'Home', url: '/home' });
      breadcrumbs.push({ label: 'Product', url: `/product/${vendorId}` });
    }

    // Handle Product Details page
    else if (currentUrl.startsWith('/productDetails')) {
      breadcrumbs.push({ label: 'Home', url: '/home' });
      breadcrumbs.push({ label: 'Product', url: `/product/${vendorId}` });
      breadcrumbs.push({ label: 'Item Summary', url: `/productDetails/${vendorId}` });
    }

    // Set the breadcrumbs
    this.breadcrumbsSubject.next(breadcrumbs);
  }
}