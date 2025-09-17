import { LoginForm } from '../../../components/login-form';

export default async function SignupPage({params}: {params: Promise<{ session: string }>}) {
    const slug = (await params).session;

    return (
        <div className="flex flex-col items-center relative top-[16rem]">
            {/* bg-muted p-6 md:p-10 */}
            <LoginForm signup={slug === "signup" ? true : false} />
        </div>
    );
}

/* Hazlo especialmente cuando no tienes ganas */