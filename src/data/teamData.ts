import { StaticImageData } from 'next/image';

import yourPhotoImage from '@/assets/images/team01.png';
import member1Image from '@/assets/images/guest.png';
import member2Image from '@/assets/images/guest.png';
import member3Image from '@/assets/images/guest.png';

export interface TeamMember {
    id: number;
    name: string;
    role: string;
    image: StaticImageData;
    bio: string;
    socials?: {
        linkedin?: string;
        twitter?: string;
        github?: string;
    };
}

export const teamData: TeamMember[] = [
    {
        id: 1,
        name: "AKASH SINGH",
        role: "Founder & Lead Developer",
        image: yourPhotoImage,
        bio: "Passionate about creating seamless car rental experiences with modern technology. Driving PrimeDrive forward.",
        socials: {
            linkedin: "https://www.linkedin.com/in/akashsingh21/",
            github: "https://github.com/iamakashsinghrajput",
        }
    },
    {
        id: 2,
        name: "Second Name",
        role: "Marketing Lead",
        image: member1Image,
        bio: "Spreading the word about PrimeDrive and ensuring our customers find the perfect ride for their needs.",
         socials: {
            linkedin: "#",
            twitter: "#",
        }
    },
    {
        id: 3,
        name: "Third Name",
        role: "Operations Manager",
        image: member2Image,
        bio: "Keeping our fleet in top shape and ensuring smooth logistics for every rental, every time.",
         socials: {
            linkedin: "#",
        }
    },
    {
        id: 4,
        name: "Forth Name",
        role: "Customer Happiness Officer",
        image: member3Image,
        bio: "Dedicated to providing exceptional support and making sure every customer journey is a happy one.",
         socials: {
             linkedin: "#",
             twitter: "#",
         }
    },
];