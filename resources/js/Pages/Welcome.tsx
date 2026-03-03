import { PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import Card from '@/Components/Card';
import { ShieldCheck, Activity, Users, FileText, MessageSquare, Clock } from 'lucide-react';

export default function Welcome({
    auth,
    laravelVersion,
    phpVersion,
}: PageProps<{ laravelVersion: string; phpVersion: string }>) {
    return (
        <>
            <Head title="Welcome | DentalLab" />

            <div className="min-h-screen bg-bg dark:bg-bg text-text dark:text-text font-sans selection:bg-brand selection:text-green-900 overflow-x-hidden">
                {/* Navbar */}
                <nav className="flex items-center justify-between px-6 py-4 bg-surface/80 dark:bg-surface/80 backdrop-blur-md border-b border-border fixed w-full z-50 transition-all duration-300">
                    <div className="flex items-center gap-3">
                        <ApplicationLogo className="w-8 h-8 fill-brand text-brand" />
                        <span className="text-xl font-bold tracking-tight text-text dark:text-text">DentalLab</span>
                    </div>
                    <div className="flex items-center gap-4">
                        {auth.user ? (
                            <Link href={route('dashboard')}>
                                <PrimaryButton className="shadow-glow">Go to Dashboard</PrimaryButton>
                            </Link>
                        ) : (
                            <>
                                <Link href={route('login')}>
                                    <SecondaryButton>Log in</SecondaryButton>
                                </Link>
                                <Link href={route('register')}>
                                    <PrimaryButton className="shadow-glow">Get Started</PrimaryButton>
                                </Link>
                            </>
                        )}
                    </div>
                </nav>

                {/* Hero Section */}
                <div className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
                        <div className="absolute top-20 left-10 w-72 h-72 bg-brand/20 rounded-full blur-[100px] animate-pulse"></div>
                        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-[120px] animate-pulse delay-1000"></div>
                    </div>

                    <div className="container mx-auto px-6 relative z-10 text-center animate-fade-in">
                        <span className="inline-block py-1 px-3 rounded-full bg-brand/20 text-green-800 dark:text-brand border border-brand/30 text-xs font-semibold uppercase tracking-wider mb-6">
                            Next-Gen Laboratory Management
                        </span>
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-8 text-text dark:text-text leading-tight">
                            Streamline Your <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-accent">Dental Workflow</span>
                        </h1>
                        <p className="text-xl text-sub max-w-2xl mx-auto mb-10 leading-relaxed">
                            Connect Clinics and Laboratories seamlessly. Manage orders, track cases, and communicate in real-time with our all-in-one platform.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            {auth.user ? (
                                <Link href={route('dashboard')}>
                                    <PrimaryButton className="w-full sm:w-auto h-12 px-8 text-base shadow-glow hover:scale-105 transition-transform">
                                        Access Dashboard
                                    </PrimaryButton>
                                </Link>
                            ) : (
                                <>
                                    <Link href={route('register')}>
                                        <PrimaryButton className="w-full sm:w-auto h-12 px-8 text-base shadow-glow hover:scale-105 transition-transform">
                                            Start Free Trial
                                        </PrimaryButton>
                                    </Link>
                                    <Link href={route('login')}>
                                        <SecondaryButton className="w-full sm:w-auto h-12 px-8 text-base hover:scale-105 transition-transform">
                                            Existing User?
                                        </SecondaryButton>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Features Grid */}
                <div className="bg-white dark:bg-surface/50 py-24 border-t border-border/50">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold mb-4 text-text dark:text-text">Everything You Need</h2>
                            <p className="text-sub max-w-xl mx-auto">Powerful tools designed specifically for modern dental clinics and laboratories.</p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <Card className="p-8 hover:border-brand/50 bg-bg group">
                                <div className="w-12 h-12 rounded-xl bg-brand/20 flex items-center justify-center mb-6 text-green-700 dark:text-brand group-hover:scale-110 transition-transform duration-300">
                                    <FileText className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-text dark:text-text">Digital Lab Orders</h3>
                                <p className="text-sub">Create complete, detailed lab orders with teeth selection wizard, file attachments, and notes.</p>
                            </Card>

                            <Card className="p-8 hover:border-brand/50 bg-bg group">
                                <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-6 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform duration-300">
                                    <Clock className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-text dark:text-text">Real-time Tracking</h3>
                                <p className="text-sub">Monitor case status from submission to delivery. Get instant updates on production stages.</p>
                            </Card>

                            <Card className="p-8 hover:border-brand/50 bg-bg group">
                                <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-6 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform duration-300">
                                    <MessageSquare className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-text dark:text-text">Instant Chat</h3>
                                <p className="text-sub">Direct communication channel between clinicians and technicians for each specific case.</p>
                            </Card>

                            <Card className="p-8 hover:border-brand/50 bg-bg group">
                                <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center mb-6 text-orange-600 dark:text-orange-400 group-hover:scale-110 transition-transform duration-300">
                                    <ShieldCheck className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-text dark:text-text">Role-Based Access</h3>
                                <p className="text-sub">Secure environments for Lab Owners, Dentists, Technicians, and Assistants with tailored permissions.</p>
                            </Card>

                            <Card className="p-8 hover:border-brand/50 bg-bg group">
                                <div className="w-12 h-12 rounded-xl bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center mb-6 text-pink-600 dark:text-pink-400 group-hover:scale-110 transition-transform duration-300">
                                    <Activity className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-text dark:text-text">Analytics & Reports</h3>
                                <p className="text-sub">Gain insights into monthly volume, revenue, and popular services with visual charts.</p>
                            </Card>

                            <Card className="p-8 hover:border-brand/50 bg-bg group">
                                <div className="w-12 h-12 rounded-xl bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center mb-6 text-teal-600 dark:text-teal-400 group-hover:scale-110 transition-transform duration-300">
                                    <Users className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-text dark:text-text">Team Management</h3>
                                <p className="text-sub">Invite and manage your staff members easily. Collaborate efficiently within your organization.</p>
                            </Card>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <footer className="bg-surface dark:bg-surface border-t border-border py-12">
                    <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-sm text-sub">
                        <div className="flex items-center gap-2 mb-4 md:mb-0">
                            <ApplicationLogo className="w-6 h-6 fill-sub text-sub opacity-50" />
                            <span>© 2026 DentalLab. All rights reserved.</span>
                        </div>
                        <div className="flex gap-6">
                            <a href="#" className="hover:text-brand transition-colors">Privacy Policy</a>
                            <a href="#" className="hover:text-brand transition-colors">Terms of Service</a>
                            <a href="#" className="hover:text-brand transition-colors">Contact Support</a>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
