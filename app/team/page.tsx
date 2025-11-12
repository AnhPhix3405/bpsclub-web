"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { 
  Linkedin, 
  ChevronRight, 
  ChevronLeft, 
  Github, 
  Mail, 
  Twitter,
  ExternalLink,
  Globe,
  MessageCircle,
  Edit,
  Code,
  HelpCircle,
  Image as ImageIcon,
  Figma,
  Video,
  Music
} from "lucide-react";
import Link from "next/link";
import {
  AnimatedSection,
  AnimatedHeading,
  AnimatedDivider,
  AnimatedCard,
} from "@/components/ui/animated-section";
import { motion, AnimatePresence } from "framer-motion";
import { 
  teamService, 
  teamUtils, 
  getSocialUrl,
  getSocialIcon,
  getPlatformDisplayName,
  formatSocialUrl,
  isValidUrl,
  type Member,
  type MemberSocial,
  type MemberRole,
  type Board 
} from "@/lib/services/teamService";

// Component for rendering social icons with dynamic platform support
const SocialIcon = ({ platform, url, size = "w-5 h-5" }: { platform: string; url: string; size?: string }) => {
  const iconType = getSocialIcon(platform);
  const formattedUrl = formatSocialUrl(url, platform);
  
  if (!formattedUrl) return null;
  
  const getIcon = () => {
    const iconClass = `${size} text-gray-700 transition-colors`;
    
    switch (iconType) {
      case 'github':
        return <Github className={`${iconClass} hover:text-black`} />;
      case 'linkedin':
        return <Linkedin className={`${iconClass} hover:text-blue-600`} />;
      case 'twitter':
        return <Twitter className={`${iconClass} hover:text-blue-400`} />;
      case 'facebook':
        return <Globe className={`${iconClass} hover:text-blue-500`} />;
      case 'instagram':
        return <Globe className={`${iconClass} hover:text-pink-500`} />;
      case 'youtube':
        return <Video className={`${iconClass} hover:text-red-500`} />;
      case 'tiktok':
        return <Video className={`${iconClass} hover:text-purple-500`} />;
      case 'mail':
        return <Mail className={`${iconClass} hover:text-green-500`} />;
      case 'globe':
        return <Globe className={`${iconClass} hover:text-blue-500`} />;
      case 'messageCircle':
        return <MessageCircle className={`${iconClass} hover:text-green-500`} />;
      case 'edit':
        return <Edit className={`${iconClass} hover:text-orange-500`} />;
      case 'code':
        return <Code className={`${iconClass} hover:text-purple-600`} />;
      case 'helpCircle':
        return <HelpCircle className={`${iconClass} hover:text-orange-600`} />;
      case 'image':
        return <ImageIcon className={`${iconClass} hover:text-pink-600`} />;
      case 'figma':
        return <Figma className={`${iconClass} hover:text-purple-500`} />;
      case 'video':
        return <Video className={`${iconClass} hover:text-red-600`} />;
      case 'music':
        return <Music className={`${iconClass} hover:text-green-600`} />;
      case 'externalLink':
      default:
        return <ExternalLink className={`${iconClass} hover:text-blue-500`} />;
    }
  };

  const platformLabel = getPlatformDisplayName(platform);
  
  return (
    <a
      href={formattedUrl}
      target={platform.toLowerCase() === 'email' ? '_self' : '_blank'}
      rel={platform.toLowerCase() === 'email' ? undefined : 'noopener noreferrer'}
      aria-label={`${platformLabel} profile`}
      title={`${platformLabel} profile`}
      className="hover:scale-110 transition-transform inline-flex"
    >
      {getIcon()}
    </a>
  );
};

export default function TeamPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState<{ [team: string]: number }>(
    {}
  );
  const [modalTeam, setModalTeam] = useState<string | null>(null);
  const [modalPage, setModalPage] = useState(1);
  const membersPerPage = 9;
  const modalMembersPerPage = 12;
  const [showAll, setShowAll] = useState(false);

  // Fetch members từ API
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const data = await teamService.getAllActiveMembers();
        // Sort members by display order
        const sortedMembers = teamUtils.sortMembersByDisplayOrder(data);
        setMembers(sortedMembers);
      } catch (error) {
        console.error('Error fetching members:', error);
        setMembers([]);
      }
    };
    fetchMembers();
  }, []);

  // Group and organize members
  const membersByBoard = teamUtils.groupMembersByBoard(members);
  const allBoards = Object.keys(membersByBoard);
  const boards = teamUtils.sortBoardsByPriority(allBoards);

  // Filter members by search query
  const filteredMembersByBoard: { [board: string]: Member[] } = {};
  boards.forEach((board) => {
    filteredMembersByBoard[board] = teamUtils.filterMembers(
      membersByBoard[board] || [], 
      searchQuery
    );
  });

  // Pagination for each board
  const paginatedMembersByBoard: { [board: string]: Member[] } = {};
  boards.forEach((board) => {
    const page = currentPage[board] || 1;
    paginatedMembersByBoard[board] = teamUtils.paginate(
      filteredMembersByBoard[board] || [],
      page,
      membersPerPage
    );
  });

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Hero Section giống ảnh mẫu */}
      <section className="relative py-20 md:py-32 bg-gradient-to-b from-[#004987] to-[#0070b8] text-white overflow-hidden">
        <div className="container relative z-10 px-4 md:px-6">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-center">
            Our team
          </h1>
          <div className="flex justify-center">
            <div className="w-24 h-1 bg-white rounded mb-8" />
          </div>
          <p className="text-lg md:text-xl text-white/90 text-center max-w-2xl mx-auto">
            With dedicated members, we are building a strong Blockchain Pioneer
            Student community
          </p>
        </div>
      </section>
      <section className="py-20 md:py-32 text-center bg-white">
        <div className="container px-4 md:px-6">
          {/* Render each board with its name */}
          {boards.map((board) => (
            <div key={board} className="mb-16">
              <h2 className="text-2xl md:text-3xl font-bold text-blue-700 mb-8 text-center border-b border-blue-200 pb-2">
                {board}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-10 justify-items-center text-center">
                {(showAll
                  ? membersByBoard[board]
                  : membersByBoard[board]?.slice(0, 5) || []
                ).map((member) => (
                  <div
                    key={member.id}
                    className="flex flex-col items-center bg-white rounded-2xl p-6 shadow-lg border border-blue-700 w-full max-w-[280px] mx-auto justify-center text-center"
                  >
                    <div className="w-32 h-32 rounded-full border-4 border-blue-700 overflow-hidden mb-4 flex items-center justify-center mx-auto">
                      <Image
                        src={member.avatar_url || '/placeholder-avatar.jpg'}
                        alt={member.full_name}
                        width={128}
                        height={128}
                        className="object-cover w-32 h-32"
                      />
                    </div>
                    <div className="text-lg font-semibold text-blue-500 mb-1 text-center">
                      {member.full_name}
                    </div>
                    <div className="uppercase text-sm text-gray-800 mb-2 text-center tracking-widest">
                      {member.role?.name || 'Member'}
                    </div>
                    <div className="flex gap-3 mt-3 justify-center flex-wrap">
                      {member.socials && member.socials.length > 0 ? (
                        member.socials
                          .filter(social => social.url && social.url.trim() !== '')
                          .slice(0, 4) // Limit to 4 social links to prevent overflow
                          .map((social, index) => (
                            <SocialIcon
                              key={`${social.platform}-${index}`}
                              platform={social.platform}
                              url={social.url}
                              size="w-5 h-5"
                            />
                          ))
                      ) : (
                        <span className="text-xs text-gray-400">No social links</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              {membersByBoard[board] && membersByBoard[board].length > 5 && (
                <div className="flex justify-center mt-8">
                  <button
                    className="px-6 py-2 rounded-lg bg-blue-700 text-white font-semibold hover:bg-blue-800 transition"
                    onClick={() => {
                      setModalTeam(board);
                      setModalPage(1);
                    }}
                  >
                    View more members
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
      {/* Modal to display all members of a division */}
      {modalTeam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-4xl w-full relative h-[80vh] overflow-y-auto">
            <button
              className="absolute top-4 right-4 text-2xl text-gray-500 hover:text-red-500"
              onClick={() => setModalTeam(null)}
              aria-label="Close"
            >
              ×
            </button>
            <h3 className="text-2xl font-bold mb-6 text-blue-700 text-center">
              {modalTeam}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
              {teamUtils.paginate(
                membersByBoard[modalTeam] || [],
                modalPage,
                modalMembersPerPage
              ).map((member) => (
                  <div
                    key={member.id}
                    className="flex flex-col items-center bg-white rounded-2xl p-4 shadow border border-blue-700 w-full max-w-[220px] mx-auto"
                  >
                    <div className="w-20 h-20 rounded-full border-4 border-blue-700 overflow-hidden mb-2 flex items-center justify-center mx-auto">
                      <Image
                        src={member.avatar_url || '/placeholder-avatar.jpg'}
                        alt={member.full_name}
                        width={80}
                        height={80}
                        className="object-cover w-20 h-20"
                      />
                    </div>
                    <div className="text-base font-semibold text-blue-500 mb-1 text-center">
                      {member.full_name}
                    </div>
                    <div className="uppercase text-xs text-gray-800 mb-2 text-center tracking-widest">
                      {member.role?.name || 'Member'}
                    </div>
                    <div className="flex gap-2 mt-2 justify-center flex-wrap">
                      {member.socials && member.socials.length > 0 ? (
                        member.socials
                          .filter(social => social.url && social.url.trim() !== '')
                          .slice(0, 3) // Limit to 3 social links for modal to save space
                          .map((social, index) => (
                            <SocialIcon
                              key={`modal-${social.platform}-${index}`}
                              platform={social.platform}
                              url={social.url}
                              size="w-4 h-4"
                            />
                          ))
                      ) : (
                        <span className="text-xs text-gray-400">No social links</span>
                      )}
                    </div>
                  </div>
                )) || []}
            </div>
            {/* Phân trang nếu cần */}
            {membersByBoard[modalTeam] && membersByBoard[modalTeam].length > modalMembersPerPage && (
              <div className="flex justify-center mt-6 gap-4">
                <button
                  className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
                  onClick={() => setModalPage((p) => Math.max(1, p - 1))}
                  disabled={modalPage === 1}
                >
                  &lt;
                </button>
                <span>
                  Page {modalPage} /{" "}
                  {teamUtils.getTotalPages(
                    membersByBoard[modalTeam]?.length || 0,
                    modalMembersPerPage
                  )}
                </span>
                <button
                  className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
                  onClick={() =>
                    setModalPage((p) =>
                      Math.min(
                        teamUtils.getTotalPages(
                          membersByBoard[modalTeam]?.length || 0,
                          modalMembersPerPage
                        ),
                        p + 1
                      )
                    )
                  }
                  disabled={
                    modalPage ===
                    teamUtils.getTotalPages(
                      membersByBoard[modalTeam]?.length || 0,
                      modalMembersPerPage
                    )
                  }
                >
                  &gt;
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
