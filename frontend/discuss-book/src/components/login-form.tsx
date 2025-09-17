'use client';

import { cn } from '@/src/lib/utils';
import { Button } from '@/src/components/button';
import { Card, CardContent } from '@/src/components/card';
import { Input } from '@/src/components/input';
import { Label } from '@/src/components/label';
import { toast } from 'sonner';
import Link from 'next/link';
import { ThemeContext } from '../state/context';
import { useContext } from 'react';
import { useRouter } from 'next/navigation';

export function LoginForm({ className, ...props }: any) {
	const { dispatch } = useContext(ThemeContext);
	const router = useRouter();

	const handleSign = async (email: string, password: string) => {
		try {

			dispatch({
				type: 'setLoading',
				payload: {
					is: true,
					message: props.signup ? 'Creating account...' : 'Logging in...',
				}
			});

			const res = await fetch(
				`http://localhost:4000/auth/${props.signup ? 'signup' : 'login'
				}`,
				{
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ email, password }),
				},
			);

			const data = await res.json();
			const headers = res.headers.get('Authorization');

			if (res.ok) {
				dispatch({
					type: 'setUser',
					payload: {
						id: data?.user?._id,
						email: data?.user?.email,
					},
				});

				/* Guardar en el LocalStorage */
				localStorage.setItem('token_discuss_book', headers || '');

				/* Redireccionar a la página principal */
				router.push('/');

				dispatch({
					type: 'setLoading',
					payload: {
						is: false,
						message: '',
					}
				});

			} else {
				toast(data.message || 'Error occurred');

				dispatch({
					type: 'setLoading',
					payload: {
						is: false,
						message: '',
					}
				});
			}
		} catch (error) {

			dispatch({
				type: 'setLoading',
				payload: {
					is: false,
					message: '',
				}
			});
			toast('Network error');
		}
	};

	const onsubmit = (e: any) => {
		e.preventDefault();

		const email = e?.target?.email?.value;
		const password = e?.target?.password?.value;
		const repeat_password = e?.target.repeat_password?.value;

		if (props.signup === true && password !== repeat_password) {
			toast("Passwords don't match");
			return;
		}

		if (!email || !password) {
			toast('Email and password are required');
			return;
		}

		if (email.length < 6 || password.length < 6) {
			toast('Email and password must be at least 6 characters');
			return;
		}

		handleSign(email, password);
	};

	return (
		<div className={cn('flex flex-col gap-6', className)} /* {...props} */>
			<Card
				className={`overflow-hidden w-[75rem] ${props.signup ? 'h-[50rem]' : 'h-[43em]'
					}`}
			>
				<CardContent className="grid p-0 md:grid-cols-2 h-full">
					<form
						className="md:p-[3rem] flex flex-col gap-10"
						onSubmit={onsubmit}
					>
						<div className="flex flex-col items-center text-center p-[2rem]">
							<h1 className="text-3xl font-bold">Welcome back</h1>
							<p className="text-balance text-[1.3rem] text-muted-foreground">
								{props.signup
									? 'Create your DiscussBook account'
									: 'Login to your DiscussBook account'}
							</p>
						</div>
						<div className="grid gap-2">
							<Label htmlFor="email" className="text-2xl">
								Email
							</Label>
							<Input
								id="email"
								type="email"
								placeholder="m@example.com"
								required
							/>
						</div>
						<div className="grid gap-2">
							<div className="flex items-center">
								<Label htmlFor="password" className="text-2xl">
									Password
								</Label>
								{/* <a
                                        href="#"
                                        className="ml-auto text-sm underline-offset-2 hover:underline"
                                    >
                                        Forgot your password?
                                    </a> */}
							</div>
							<Input
								id="password"
								type="password"
								required
								placeholder="more than 7 characteres"
							/>
						</div>
						{props.signup && (
							<div className="grid gap-2">
								<div className="flex items-center">
									<Label
										htmlFor="repeat_password"
										className="text-2xl"
									>
										Repeat Password
									</Label>
									{/* <a
                                        href="#"
                                        className="ml-auto text-sm underline-offset-2 hover:underline"
                                    >
                                        Forgot your password?
                                    </a> */}
								</div>
								<Input
									id="repeat_password"
									type="password"
									required
									placeholder="more than 7 characteres"
								/>
							</div>
						)}
						<Button
							type="submit"
							className="h-[3rem] cursor-pointer w-full bg-neutral-50 text-neutral-950 text-2xl"
						>
							{props.signup ? 'Sign up' : 'Login'}
						</Button>
						{/*  <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                            <span className="text-[1.3rem] relative z-10 bg-neutral-950 px-2 text-muted-foreground">
                                Or continue with
                            </span>
                        </div> */}
						{/* <div className="flex flex-row justify-center gap-2">
                            <Button
                                variant="outline"
                                className="w-[6rem] cursor-pointer"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                                        fill="currentColor"
                                    />
                                </svg>
                                <span className="sr-only">
                                    Login with Google
                                </span>
                            </Button>
                        </div> */}
						<div className="text-center text-[1.3rem]">
							{props.signup
								? 'Already have an account? '
								: "Don't have an account? "}
							<Link
								href={
									props.signup
										? '/auth/login'
										: '/auth/signup'
								}
								className="underline underline-offset-4 text-[1.3rem]"
							>
								{props.signup ? 'Login' : 'Sign up'}
							</Link>
						</div>
					</form>
					<div className="relative hidden h-full bg-muted md:block bg-white">
						{/* <div
                            src="/placeholder.svg"
                            alt="Image"
                            className="h-full w-full dark:grayscale bg-white object-cover dark:brightness-[0.2]"
                        /> */}
					</div>
				</CardContent>
			</Card>
			{/* <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
                By clicking continue, you agree to our{' '}
                <a href="#">Terms of Service</a> and{' '}
                <a href="#">Privacy Policy</a>.
            </div> */}
		</div>
	);
}
