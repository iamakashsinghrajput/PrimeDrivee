"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, Linkedin, Twitter, Github } from 'lucide-react';

import { teamData, TeamMember } from '@/data/teamData';

const TeamMemberCard: React.FC<{ member: TeamMember }> = ({ member }) => (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 text-center flex flex-col items-center p-6 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
        <div className="relative w-32 h-32 mb-4">
            <Image
                src={member.image}
                alt={`Photo of ${member.name}`}
                layout="fill"
                objectFit="cover"
                className="rounded-full border-4 border-white shadow-md"
                sizes="128px"
            />
        </div>

        <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
        <p className="text-sm font-medium text-indigo-600 mb-3">{member.role}</p>

        <p className="text-sm text-gray-600 mb-4 flex-grow px-2">
            {member.bio}
        </p>

        {member.socials && (
            <div className="flex justify-center space-x-4 mt-auto pt-3 border-t border-gray-100 w-full">
                {member.socials.linkedin && (
                    <a href={member.socials.linkedin} target="_blank" rel="noopener noreferrer" aria-label={`${member.name} LinkedIn Profile`} className="text-gray-400 hover:text-blue-700 transition-colors">
                        <Linkedin size={20} />
                    </a>
                )}
                {member.socials.twitter && (
                    <a href={member.socials.twitter} target="_blank" rel="noopener noreferrer" aria-label={`${member.name} Twitter Profile`} className="text-gray-400 hover:text-sky-500 transition-colors">
                        <Twitter size={20} />
                    </a>
                )}
                 {member.socials.github && (
                    <a href={member.socials.github} target="_blank" rel="noopener noreferrer" aria-label={`${member.name} GitHub Profile`} className="text-gray-400 hover:text-gray-800 transition-colors">
                        <Github size={20} />
                    </a>
                )}
            </div>
        )}
    </div>
);


const TeamsPage = () => {
  return (
    <div className="container mx-auto px-8 py-8 bg-gray-100 min-h-screen">

        <div className="mb-6">
            <Link href="/" className="text-sm text-blue-600 hover:text-blue-800 inline-flex items-center gap-1 transition-colors">
                <ChevronLeft size={16} /> Back to Home
            </Link>
        </div>

        <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-3 text-gray-900">Meet the PrimeDrive Team</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">The passionate individuals dedicated to making your car rental experience exceptional.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamData.map(member => (
                <TeamMemberCard key={member.id} member={member} />
            ))}
        </div>

    </div>
  );
};

export default TeamsPage;