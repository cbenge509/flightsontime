import {expect, test} from '@playwright/test';

test.describe('Home Page', () => {
  test.beforeEach(async ({page}) => {
    await page.goto('/flightsontime/');
  });

  test('should load the home page with correct title', async ({page}) => {
    await expect(page).toHaveTitle(/Flight Delay Prediction/);
  });

  test('should display hero section with headline', async ({page}) => {
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
    await expect(heading).toContainText('Predicting Flight Delays');
  });

  test('should display key metrics in hero', async ({page}) => {
    const heroSection = page.locator('#hero');
    await expect(heroSection).toBeVisible();
    await expect(heroSection).toContainText('31M+');
    await expect(heroSection).toContainText('2015-2019');
    await expect(heroSection).toContainText('F1: 0.44');
  });

  test('should display problem section', async ({page}) => {
    const problemSection = page.locator('#problem');
    await expect(problemSection).toBeVisible();
    await expect(problemSection).toContainText('$28B');
    await expect(problemSection).toContainText('Problem');
  });

  test('should display data section with dataset info', async ({page}) => {
    const dataSection = page.locator('#data');
    await expect(dataSection).toBeVisible();
    await expect(dataSection).toContainText('The Data');
    await expect(dataSection).toContainText('31,746,841');
    await expect(dataSection).toContainText('Flights');
    await expect(dataSection).toContainText('Weather');
    await expect(dataSection).toContainText('Stations');
  });

  test('should display discovery section with EDA visualizations', async ({
    page,
  }) => {
    const discoverySection = page.locator('#discovery');
    await expect(discoverySection).toBeVisible();
    await expect(discoverySection).toContainText('Discovery');
    await expect(discoverySection).toContainText('Which Airlines Delay Most?');
    await expect(discoverySection).toContainText('Geographic Patterns');
    await expect(discoverySection).toContainText('The Correlation Story');
    await expect(discoverySection).toContainText('The Previous Flight Effect');
  });

  test('should display discovery section images', async ({page}) => {
    const discoverySection = page.locator('#discovery');
    const images = discoverySection.locator('img');
    await expect(images).toHaveCount(4);
  });

  test('should display approach section with architecture', async ({page}) => {
    const approachSection = page.locator('#approach');
    await expect(approachSection).toBeVisible();
    await expect(approachSection).toContainText('The Approach');
    await expect(approachSection).toContainText('Solution Architecture');
    await expect(approachSection).toContainText('Feature Engineering');
    await expect(approachSection).toContainText('Model Selection');
  });

  test('should display approach section with top features', async ({page}) => {
    const approachSection = page.locator('#approach');
    await expect(approachSection).toContainText('DEP_DEL15_PREV');
    await expect(approachSection).toContainText('CRS_DEP_TIME_bucket');
    await expect(approachSection).toContainText('OD_GROUP');
  });

  test('should display approach section model cards', async ({page}) => {
    const approachSection = page.locator('#approach');
    await expect(approachSection).toContainText('Logistic Regression');
    await expect(approachSection).toContainText('Random Forest');
    await expect(approachSection).toContainText('Neural Network');
  });

  test('should display results section with metrics', async ({page}) => {
    const resultsSection = page.locator('#results');
    await expect(resultsSection).toBeVisible();
    await expect(resultsSection).toContainText('Results');
    await expect(resultsSection).toContainText('F1 Score');
    await expect(resultsSection).toContainText('AUC-ROC');
  });

  test('should display results section model comparison', async ({page}) => {
    const resultsSection = page.locator('#results');
    await expect(resultsSection).toContainText('0.41'); // LR F1
    await expect(resultsSection).toContainText('0.44'); // RF F1
    await expect(resultsSection).toContainText('0.49'); // NN F1
  });

  test('should display results section key insight', async ({page}) => {
    const resultsSection = page.locator('#results');
    await expect(resultsSection).toContainText('Key Finding');
    await expect(resultsSection).toContainText('6 features');
    await expect(resultsSection).toContainText('94%');
  });

  test('should display footer with team members', async ({page}) => {
    const footer = page.locator('#footer');
    await expect(footer).toBeVisible();
    await expect(footer).toContainText('Cristopher Benge');
    await expect(footer).toContainText('UC Berkeley');
  });

  test('should have scroll indicator in hero', async ({page}) => {
    const scrollIndicator = page.locator('#hero').getByText('Scroll');
    await expect(scrollIndicator).toBeVisible();
  });

  test('should have GitHub link in footer', async ({page}) => {
    const githubLink = page.locator(
      'a[href="https://github.com/cbenge509/flightsontime"]',
    );
    await expect(githubLink).toBeVisible();
  });

  test('all sections should be present in correct order', async ({page}) => {
    const sections = [
      'hero',
      'problem',
      'data',
      'discovery',
      'approach',
      'results',
      'footer',
    ];
    for (const sectionId of sections) {
      const section = page.locator(`#${sectionId}`);
      await expect(section).toBeVisible();
    }
  });
});

test.describe('Interactive Features - Phase 5', () => {
  test.beforeEach(async ({page}) => {
    await page.goto('/flightsontime/');
  });

  test('should have flight map canvas in hero', async ({page}) => {
    const canvas = page.locator('#flight-map-canvas');
    await expect(canvas).toBeVisible();
    await expect(canvas).toHaveAttribute('aria-hidden', 'true');
  });

  test('should have counter elements with data attributes', async ({page}) => {
    const heroSection = page.locator('#hero');
    const counters = heroSection.locator('[data-counter]');
    await expect(counters).toHaveCount(2); // 31M and F1 counters
  });

  test('should display model slider in results section', async ({page}) => {
    const resultsSection = page.locator('#results');
    const slider = resultsSection.locator('[data-model-slider]');
    await expect(slider).toBeVisible();
  });

  test('should display model name display in results', async ({page}) => {
    const resultsSection = page.locator('#results');
    const modelName = resultsSection.locator('[data-model-name]');
    await expect(modelName).toBeVisible();
    await expect(modelName).toContainText('Random Forest'); // Default
  });

  test('model slider should update model name when changed', async ({page}) => {
    const resultsSection = page.locator('#results');
    const slider = resultsSection.locator('[data-model-slider]');
    const modelName = resultsSection.locator('[data-model-name]');

    // Default should be Random Forest (value 1)
    await expect(modelName).toContainText('Random Forest');

    // Change to Logistic Regression (value 0)
    await slider.fill('0');
    await expect(modelName).toContainText('Logistic Regression');

    // Change to Neural Network (value 2)
    await slider.fill('2');
    await expect(modelName).toContainText('Neural Network');
  });

  test('should display F1 and AUC metrics in slider display', async ({
    page,
  }) => {
    const resultsSection = page.locator('#results');
    const f1Display = resultsSection.locator('[data-model-f1]');
    const aucDisplay = resultsSection.locator('[data-model-auc]');

    await expect(f1Display).toBeVisible();
    await expect(aucDisplay).toBeVisible();
  });

  test('model slider should update metrics when changed', async ({page}) => {
    const resultsSection = page.locator('#results');
    const slider = resultsSection.locator('[data-model-slider]');
    const f1Display = resultsSection.locator('[data-model-f1]');

    // Change to Neural Network (value 2)
    await slider.fill('2');

    // Wait for animation to complete
    await page.waitForTimeout(500);

    // Should show Neural Network F1 (0.49)
    await expect(f1Display).toContainText('0.49');
  });

  test('should have model dots indicators', async ({page}) => {
    const resultsSection = page.locator('#results');
    const dots = resultsSection.locator('.model-dots .dot');
    await expect(dots).toHaveCount(3);
  });

  test('should have animated bar elements in results', async ({page}) => {
    const resultsSection = page.locator('#results');
    const animatedBars = resultsSection.locator('[data-animate-bar]');
    // 3 F1 bars + 6 feature importance bars = 9
    await expect(animatedBars).toHaveCount(9);
  });

  test('should have animation classes on elements', async ({page}) => {
    const heroSection = page.locator('#hero');
    const animatedElements = heroSection.locator('.animate-fade-up');
    const count = await animatedElements.count();
    expect(count).toBeGreaterThan(0);
  });

  test('elements should become visible on scroll', async ({page}) => {
    // Scroll to results section
    await page.locator('#results').scrollIntoViewIfNeeded();

    // Wait for animations
    await page.waitForTimeout(1000);

    // Check that animated elements have the visible class
    const resultsSection = page.locator('#results');
    const visibleElements = resultsSection.locator('.visible');
    const count = await visibleElements.count();
    expect(count).toBeGreaterThan(0);
  });
});

test.describe('Accessibility', () => {
  test.beforeEach(async ({page}) => {
    await page.goto('/flightsontime/');
  });

  test('should have skip to content link', async ({page}) => {
    const skipLink = page.locator('a.skip-to-content');
    await expect(skipLink).toBeAttached();
  });

  test('canvas should have aria-hidden', async ({page}) => {
    const canvas = page.locator('#flight-map-canvas');
    await expect(canvas).toHaveAttribute('aria-hidden', 'true');
  });

  test('slider should have aria-label', async ({page}) => {
    const slider = page.locator('[data-model-slider]');
    await expect(slider).toHaveAttribute(
      'aria-label',
      'Select model for comparison',
    );
  });

  test('should have proper heading hierarchy', async ({page}) => {
    const h1 = page.locator('h1');
    const h2 = page.locator('h2');
    const h3 = page.locator('h3');

    await expect(h1).toHaveCount(1);
    expect(await h2.count()).toBeGreaterThan(0);
    expect(await h3.count()).toBeGreaterThan(0);
  });

  test('decorative SVGs should have aria-hidden', async ({page}) => {
    // Check that decorative SVGs in problem section have aria-hidden
    const problemSection = page.locator('#problem');
    const svgs = problemSection.locator('svg[aria-hidden="true"]');
    expect(await svgs.count()).toBeGreaterThan(0);
  });

  test('main element should have role', async ({page}) => {
    const main = page.locator('main[role="main"]');
    await expect(main).toBeVisible();
  });

  test('external links should have proper attributes', async ({page}) => {
    const externalLinks = page.locator('a[target="_blank"]');
    const count = await externalLinks.count();
    for (let i = 0; i < count; i++) {
      const link = externalLinks.nth(i);
      await expect(link).toHaveAttribute('rel', /noopener/);
    }
  });
});

test.describe('Performance - Phase 6.1', () => {
  test.beforeEach(async ({page}) => {
    await page.goto('/flightsontime/');
  });

  test('should have preconnect hints for fonts', async ({page}) => {
    const preconnectGoogle = page.locator(
      'link[rel="preconnect"][href="https://fonts.googleapis.com"]',
    );
    const preconnectGstatic = page.locator(
      'link[rel="preconnect"][href="https://fonts.gstatic.com"]',
    );

    await expect(preconnectGoogle).toBeAttached();
    await expect(preconnectGstatic).toBeAttached();
  });

  test('should have theme color meta tag', async ({page}) => {
    const themeColor = page.locator('meta[name="theme-color"]');
    await expect(themeColor).toHaveAttribute('content', '#1a1a2e');
  });

  test('images should have loading lazy attribute', async ({page}) => {
    // Scroll to discovery section to ensure images are in DOM
    await page.locator('#discovery').scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    const images = page.locator('#discovery img');
    const count = await images.count();
    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      await expect(img).toHaveAttribute('loading', 'lazy');
    }
  });
});

test.describe('Console Errors - Phase 6.5', () => {
  test('should have no console errors on load', async ({page}) => {
    const consoleErrors: string[] = [];

    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    await page.goto('/flightsontime/');
    await page.waitForTimeout(2000); // Wait for animations and scripts

    // Filter out expected errors (e.g., favicon 404 in development)
    const unexpectedErrors = consoleErrors.filter(
      error => !error.includes('favicon'),
    );

    expect(unexpectedErrors).toHaveLength(0);
  });

  test('should have no console errors when scrolling', async ({page}) => {
    const consoleErrors: string[] = [];

    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    await page.goto('/flightsontime/');

    // Scroll through all sections
    const sections = [
      '#problem',
      '#data',
      '#discovery',
      '#approach',
      '#results',
      '#footer',
    ];
    for (const section of sections) {
      await page.locator(section).scrollIntoViewIfNeeded();
      await page.waitForTimeout(300);
    }

    const unexpectedErrors = consoleErrors.filter(
      error => !error.includes('favicon'),
    );

    expect(unexpectedErrors).toHaveLength(0);
  });
});

test.describe('Responsive Design - Phase 6.4', () => {
  test('should display correctly on mobile portrait (375px)', async ({
    page,
  }) => {
    await page.setViewportSize({width: 375, height: 667});
    await page.goto('/flightsontime/');

    const heroSection = page.locator('#hero');
    await expect(heroSection).toBeVisible();

    // Check headline is visible
    const headline = page.locator('h1');
    await expect(headline).toBeVisible();
  });

  test('should display correctly on mobile landscape (667px)', async ({
    page,
  }) => {
    await page.setViewportSize({width: 667, height: 375});
    await page.goto('/flightsontime/');

    const heroSection = page.locator('#hero');
    await expect(heroSection).toBeVisible();
  });

  test('should display correctly on tablet (768px)', async ({page}) => {
    await page.setViewportSize({width: 768, height: 1024});
    await page.goto('/flightsontime/');

    // Check all sections are visible
    const sections = ['#hero', '#problem', '#data'];
    for (const section of sections) {
      await page.locator(section).scrollIntoViewIfNeeded();
      await expect(page.locator(section)).toBeVisible();
    }
  });

  test('should display correctly on desktop (1280px)', async ({page}) => {
    await page.setViewportSize({width: 1280, height: 800});
    await page.goto('/flightsontime/');

    const heroSection = page.locator('#hero');
    await expect(heroSection).toBeVisible();

    // Desktop should have more horizontal layout
    const statBoxes = page.locator('#hero .stat-box');
    expect(await statBoxes.count()).toBe(3);
  });

  test('should display correctly on large desktop (1920px)', async ({page}) => {
    await page.setViewportSize({width: 1920, height: 1080});
    await page.goto('/flightsontime/');

    const heroSection = page.locator('#hero');
    await expect(heroSection).toBeVisible();
  });
});

test.describe('Visual Regression - Phase 6.5', () => {
  test('hero section visual snapshot', async ({page}) => {
    await page.setViewportSize({width: 1280, height: 800});
    await page.goto('/flightsontime/');
    await page.waitForTimeout(2000); // Wait for animations

    const heroSection = page.locator('#hero');
    await expect(heroSection).toHaveScreenshot('hero-section.png', {
      maxDiffPixels: 100, // Allow small differences for animations
    });
  });

  test('results section visual snapshot', async ({page}) => {
    await page.setViewportSize({width: 1280, height: 800});
    await page.goto('/flightsontime/');

    const resultsSection = page.locator('#results');
    await resultsSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1500); // Wait for scroll animations

    await expect(resultsSection).toHaveScreenshot('results-section.png', {
      maxDiffPixels: 100,
    });
  });
});
