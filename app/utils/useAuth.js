import { useCallback } from 'react';
import { useRouter } from 'next/navigation';

function useAuth() {
	const router = useRouter();

	const callbackUrl =
		typeof window !== 'undefined'
			? new URLSearchParams(window.location.search).get('callbackUrl')
			: null;

	const signInWithCredentials = useCallback(
		async (options) => {
			// Mock sign in - just redirect to callback URL or admin
			const redirectUrl = options?.callbackUrl ?? callbackUrl ?? '/admin';
			router.push(redirectUrl);
		},
		[callbackUrl, router]
	);

	const signUpWithCredentials = useCallback(
		async (options) => {
			// Mock sign up - redirect to onboarding or callback URL
			const redirectUrl = options?.callbackUrl ?? callbackUrl ?? '/onboarding';
			router.push(redirectUrl);
		},
		[callbackUrl, router]
	);

	const signInWithGoogle = useCallback(
		async (options) => {
			const redirectUrl = options?.callbackUrl ?? callbackUrl ?? '/admin';
			router.push(redirectUrl);
		},
		[callbackUrl, router]
	);

	const signInWithFacebook = useCallback(
		async (options) => {
			const redirectUrl = options?.callbackUrl ?? callbackUrl ?? '/admin';
			router.push(redirectUrl);
		},
		[]
	);

	const signInWithTwitter = useCallback(
		async (options) => {
			const redirectUrl = options?.callbackUrl ?? callbackUrl ?? '/admin';
			router.push(redirectUrl);
		},
		[]
	);

	const signOut = useCallback(
		async () => {
			router.push('/');
		},
		[router]
	);

	return {
		signInWithCredentials,
		signUpWithCredentials,
		signInWithGoogle,
		signInWithFacebook,
		signInWithTwitter,
		signOut,
	};
}

export default useAuth;
