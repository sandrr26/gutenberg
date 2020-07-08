/**
 * Internal dependencies
 */
import { activateTheme } from './activate-theme';
import { installTheme } from './install-theme';
import { switchUserToAdmin } from './switch-user-to-admin';
import { switchUserToTest } from './switch-user-to-test';
import { visitAdminPage } from './visit-admin-page';

/**
 * Deletes a theme from the site, activating another theme if necessary.
 *
 * @param {string} slug        Theme slug.
 * @param {string?} newThemeSlug A theme to switch to if the theme to delete is active. Required if the theme to delete is active.
 * @param {string?} newThemeSearchTerm A search term to use if the new theme is not findable by its slug.
 */
export async function deleteTheme( slug, newThemeSlug, newThemeSearchTerm ) {
	await switchUserToAdmin();

	if ( newThemeSlug ) {
		await installTheme( newThemeSlug, newThemeSearchTerm );
		await activateTheme( newThemeSlug );
	} else {
		await visitAdminPage( 'themes.php' );
	}

	await page.click( `[data-slug="${ slug }"]` );
	await page.waitForSelector( '.theme-actions .delete-theme' );
	await page.click( '.theme-actions .delete-theme' );

	// Wait for the theme to be removed from the page.
	// eslint-disable-next-line no-restricted-syntax
	await page.waitFor(
		( themeSlug ) =>
			! document.querySelector( `[data-slug="${ themeSlug }"]` ),
		slug
	);

	await switchUserToTest();
}
