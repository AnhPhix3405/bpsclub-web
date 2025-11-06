"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Linkedin, ChevronRight, ChevronLeft } from "lucide-react";
import Link from "next/link";
import {
  AnimatedSection,
  AnimatedHeading,
  AnimatedDivider,
  AnimatedCard,
} from "@/components/ui/animated-section";
import { motion, AnimatePresence } from "framer-motion";
import { Github, Mail } from "lucide-react";
import { 
  teamService, 
  teamUtils, 
  getSocialUrl,
  type Member,
  type MemberSocial,
  type MemberRole,
  type Board 
} from "@/lib/services/teamService";

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
                    <div className="flex gap-4 mt-3 justify-center">
                      {getSocialUrl(member.socials, 'github') && (
                        <a
                          href={getSocialUrl(member.socials, 'github')}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="GitHub"
                        >
                          <Github className="w-5 h-5 text-gray-700 hover:text-blue-500 transition" />
                        </a>
                      )}
                      {getSocialUrl(member.socials, 'linkedin') && (
                        <a
                          href={getSocialUrl(member.socials, 'linkedin')}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="LinkedIn"
                        >
                          <Linkedin className="w-5 h-5 text-gray-700 hover:text-blue-500 transition" />
                        </a>
                      )}
                      {getSocialUrl(member.socials, 'email') && (
                        <a href={`mailto:${getSocialUrl(member.socials, 'email')}`} aria-label="Email">
                          <Mail className="w-5 h-5 text-gray-700 hover:text-blue-500 transition" />
                        </a>
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
                    <div className="flex gap-2 mt-2 justify-center">
                      {getSocialUrl(member.socials, 'github') && (
                        <a
                          href={getSocialUrl(member.socials, 'github')}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="GitHub"
                        >
                          <Github className="w-4 h-4 text-gray-700 hover:text-blue-500 transition" />
                        </a>
                      )}
                      {getSocialUrl(member.socials, 'linkedin') && (
                        <a
                          href={getSocialUrl(member.socials, 'linkedin')}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="LinkedIn"
                        >
                          <Linkedin className="w-4 h-4 text-gray-700 hover:text-blue-500 transition" />
                        </a>
                      )}
                      {getSocialUrl(member.socials, 'email') && (
                        <a href={`mailto:${getSocialUrl(member.socials, 'email')}`} aria-label="Email">
                          <Mail className="w-4 h-4 text-gray-700 hover:text-blue-500 transition" />
                        </a>
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
