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

// Định nghĩa type cho member
export type Member = {
  id: number;
  name: string;
  role: string;
  image_url: string;
  bio: string;
  achievements: string[];
  github: string;
  linkedin: string;
  email: string;
  team_name: string;
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
      const res = await fetch("/api/members");
      const data = await res.json();
      setMembers(data.data || []);
    };
    fetchMembers();
  }, []);

  // Danh sách thứ tự ban ưu tiên
  const teamOrder = [
    "Advisory Board",
    "Executive Board",
    "Specialist Board",
    "Media Board",
    "Logistics Board",
    "External Relations Board",
  ];
  // Map Vietnamese team names to English for display (if API returns Vietnamese)
  const teamNameMap: { [key: string]: string } = {
    "Ban Cố vấn": "Advisory Board",
    "Ban Chủ nhiệm": "Executive Board",
    "Ban Chuyên môn": "Specialist Board",
    "Ban Truyền thông": "Media Board",
    "Ban Hậu cần": "Logistics Board",
    "Ban Ngoại giao": "External Relations Board",
  };
  // Lấy danh sách các ban từ dữ liệu members, giữ thứ tự ưu tiên, các ban khác xếp sau
  const allTeams = Array.from(
    new Set(members.map((m) => teamNameMap[m.team_name] || m.team_name))
  );
  const teams = [
    ...teamOrder.filter((t) => allTeams.includes(t)),
    ...allTeams.filter((t) => !teamOrder.includes(t)),
  ];

  // Nhóm thành viên theo team_name
  const membersByTeam: { [team: string]: Member[] } = {};
  teams.forEach((team) => {
    membersByTeam[team] = members.filter(
      (m) => (teamNameMap[m.team_name] || m.team_name) === team
    );
  });

  // Lọc theo search cho từng ban
  const filteredMembersByTeam: { [team: string]: Member[] } = {};
  teams.forEach((team) => {
    filteredMembersByTeam[team] = membersByTeam[team].filter(
      (member) =>
        member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.bio.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // Phân trang cho từng ban
  const paginatedMembersByTeam: { [team: string]: Member[] } = {};
  teams.forEach((team) => {
    const page = currentPage[team] || 1;
    paginatedMembersByTeam[team] = filteredMembersByTeam[team].slice(
      (page - 1) * membersPerPage,
      page * membersPerPage
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
          {/* Render each division with its name */}
          {teams.map((team) => (
            <div key={team} className="mb-16">
              <h2 className="text-2xl md:text-3xl font-bold text-blue-700 mb-8 text-center border-b border-blue-200 pb-2">
                {team}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-10 justify-items-center text-center">
                {(showAll
                  ? membersByTeam[team]
                  : membersByTeam[team]?.slice(0, 5) || []
                ).map((member) => (
                  <div
                    key={member.id}
                    className="flex flex-col items-center bg-white rounded-2xl p-6 shadow-lg border border-blue-700 w-full max-w-[280px] mx-auto justify-center text-center"
                  >
                    <div className="w-32 h-32 rounded-full border-4 border-blue-700 overflow-hidden mb-4 flex items-center justify-center mx-auto">
                      <Image
                        src={member.image_url}
                        alt={member.name}
                        width={128}
                        height={128}
                        className="object-cover w-32 h-32"
                      />
                    </div>
                    <div className="text-lg font-semibold text-blue-500 mb-1 text-center">
                      {member.name}
                    </div>
                    <div className="uppercase text-sm text-gray-800 mb-2 text-center tracking-widest">
                      {member.role}
                    </div>
                    <div className="flex gap-4 mt-3 justify-center">
                      {member.github && (
                        <a
                          href={member.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="GitHub"
                        >
                          <Github className="w-5 h-5 text-gray-700 hover:text-blue-500 transition" />
                        </a>
                      )}
                      {member.linkedin && (
                        <a
                          href={member.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="LinkedIn"
                        >
                          <Linkedin className="w-5 h-5 text-gray-700 hover:text-blue-500 transition" />
                        </a>
                      )}
                      {member.email && (
                        <a href={`mailto:${member.email}`} aria-label="Email">
                          <Mail className="w-5 h-5 text-gray-700 hover:text-blue-500 transition" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              {membersByTeam[team] && membersByTeam[team].length > 5 && (
                <div className="flex justify-center mt-8">
                  <button
                    className="px-6 py-2 rounded-lg bg-blue-700 text-white font-semibold hover:bg-blue-800 transition"
                    onClick={() => {
                      setModalTeam(team);
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
              {membersByTeam[modalTeam]
                .slice(
                  (modalPage - 1) * modalMembersPerPage,
                  modalPage * modalMembersPerPage
                )
                .map((member) => (
                  <div
                    key={member.id}
                    className="flex flex-col items-center bg-white rounded-2xl p-4 shadow border border-blue-700 w-full max-w-[220px] mx-auto"
                  >
                    <div className="w-20 h-20 rounded-full border-4 border-blue-700 overflow-hidden mb-2 flex items-center justify-center mx-auto">
                      <Image
                        src={member.image_url}
                        alt={member.name}
                        width={80}
                        height={80}
                        className="object-cover w-20 h-20"
                      />
                    </div>
                    <div className="text-base font-semibold text-blue-500 mb-1 text-center">
                      {member.name}
                    </div>
                    <div className="uppercase text-xs text-gray-800 mb-2 text-center tracking-widest">
                      {member.role}
                    </div>
                    <div className="flex gap-2 mt-2 justify-center">
                      {member.github && (
                        <a
                          href={member.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="GitHub"
                        >
                          <Github className="w-4 h-4 text-gray-700 hover:text-blue-500 transition" />
                        </a>
                      )}
                      {member.linkedin && (
                        <a
                          href={member.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="LinkedIn"
                        >
                          <Linkedin className="w-4 h-4 text-gray-700 hover:text-blue-500 transition" />
                        </a>
                      )}
                      {member.email && (
                        <a href={`mailto:${member.email}`} aria-label="Email">
                          <Mail className="w-4 h-4 text-gray-700 hover:text-blue-500 transition" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
            </div>
            {/* Phân trang nếu cần */}
            {membersByTeam[modalTeam].length > modalMembersPerPage && (
              <div className="flex justify-center mt-6 gap-4">
                <button
                  className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
                  onClick={() => setModalPage((p) => Math.max(1, p - 1))}
                  disabled={modalPage === 1}
                >
                  &lt;
                </button>
                <span>
                  Trang {modalPage} /{" "}
                  {Math.ceil(
                    membersByTeam[modalTeam].length / modalMembersPerPage
                  )}
                </span>
                <button
                  className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
                  onClick={() =>
                    setModalPage((p) =>
                      Math.min(
                        Math.ceil(
                          membersByTeam[modalTeam].length / modalMembersPerPage
                        ),
                        p + 1
                      )
                    )
                  }
                  disabled={
                    modalPage ===
                    Math.ceil(
                      membersByTeam[modalTeam].length / modalMembersPerPage
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
