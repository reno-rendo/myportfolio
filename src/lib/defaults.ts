
import {
    Home,
    FolderOpen,
    User,
    Settings,
    FileText,
    Trophy,
    Mail
} from 'lucide-react';

export const DEFAULTS = {
    profile: {
        id: 'main',
        name: 'Reno Rendo',
        bio: 'A passionate Fullstack & Frontend Developer',
        specialization: 'Fullstack & Frontend Developer',
        email: 'ggrignionrendo@gmail.com',
        location: 'Kupang, Indonesia',
        about: `I’m a full-stack developer who builds simple, stable and easy-to-use features. I’m not great at everything, but I learn fast and I care about doing things properly.

Real projects taught me something important: good software comes from clear thinking and fixing one problem at a time. No shortcuts.

What drives me is simple. When someone uses something I built and it “just works,” that’s enough. That’s what keeps me improving and aiming to build software that lasts.`,
        github: 'https://github.com/reno-rendo',
        linkedin: 'https://www.linkedin.com/in/reno-rendo-073034304/',
        resumeUrl: 'https://drive.google.com/file/d/1yPVP9owGiyYQQlwRoE8ktR00_pL5Gl6z/view?usp=sharing'
    },

    stats: [
        { number: '02+', label: 'Years Of Experience' },
        { number: '10+', label: 'Projects Done' }
    ],

    navLinks: [
        { label: 'Home', link: '#hero', icon: Home },
        { label: 'Projects', link: '#projects', icon: FolderOpen },
        { label: 'About', link: '#about', icon: User },
        { label: 'Services', link: '#services', icon: Settings },
        { label: 'Resume', link: '#resume', icon: FileText },
        { label: 'Achievements', link: '#achievements', icon: Trophy },
        { label: 'Contact', link: '#contact', icon: Mail },
    ]
};
