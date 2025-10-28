"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Users, BookOpen, Award, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Image from "next/image";

// Schema validation
const formSchema = z.object({
  ho_ten: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(50, "Full name must be at most 50 characters")
    .regex(
      /^[\p{L}\s-]+$/u,
      "Full name can only contain letters, spaces and hyphens"
    )
    .transform((val) => val.normalize("NFC")),

  ma_sinh_vien: z
    .string()
    .min(5, "Student ID must be at least 5 characters")
    .max(15, "Student ID must be at most 15 characters")
    .regex(/^[A-Za-z0-9]+$/, "Student ID can only contain letters and numbers"),
  email: z
    .string()
    .email("Invalid email")
    .min(5, "Email must be at least 5 characters")
    .max(100, "Email must be at most 100 characters"),
  so_dien_thoai: z
    .string()
    .optional()
    .refine((val) => {
      if (!val || val.trim() === "") return true;
      // Count digits in the string
      const digitCount = (val.match(/\d/g) || []).length;
      return /^[0-9+\-\s()]+$/.test(val) && digitCount >= 8 && digitCount <= 15;
    }, "Phone number must contain 8 to 15 digits"),
  khoa_nganh: z.string().min(1, "Please select faculty/major"),
  nam_hoc: z.string().min(1, "Please select your year of study"),
  linh_vuc_quan_tam: z
    .array(z.string())
    .min(1, "Please select at least one field")
    .max(6, "You can select up to 6 fields"),
  ban_tham_gia: z.string().min(1, "Please choose a division to join"),
  kinh_nghiem_blockchain: z
    .string()
    .optional()
    .refine((val) => {
      if (!val || val.trim() === "") return true;
      return val.length <= 500;
    }, "Experience must be at most 500 characters"),
  ly_do_tham_gia: z
    .string()
    .min(10, "Reason must be at least 10 characters")
    .max(1000, "Reason must be at most 1000 characters")
    .refine(
      (val) => val.trim().length >= 10,
      "Reason cannot be only whitespace"
    ),
  truong: z.string().min(1, "Please select your university/organization"),
});

type FormData = z.infer<typeof formSchema>;

type FormFields = keyof FormData;

export default function JoinPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ho_ten: "",
      ma_sinh_vien: "",
      email: "",
      so_dien_thoai: "",
      khoa_nganh: "",
      nam_hoc: "",
      linh_vuc_quan_tam: [],
      ban_tham_gia: "",
      kinh_nghiem_blockchain: "",
      ly_do_tham_gia: "",
      truong: "",
    },
  });

  async function onSubmit(data: FormData) {
    try {
      setIsSubmitting(true);

      // Hiển thị thông báo đang xử lý
      toast.loading("Submitting your application...", {
        id: "submitting-form",
      });

      // Chuyển đổi mảng lĩnh vực quan tâm thành chuỗi
      const submitData = {
        ...data,
        linh_vuc_quan_tam: data.linh_vuc_quan_tam.join(", "),
      };

      const response = await fetch("/api/join", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      });

      const result = await response.json();

      if (!response.ok) {
        // Dismiss loading toast
        toast.dismiss("submitting-form");

        if (result.errors) {
          result.errors.forEach((error: { field: string; message: string }) => {
            form.setError(error.field as FormFields, {
              type: "server",
              message: error.message,
            });
          });
          toast.error("Please review your information", {
            description: "Some fields are not in the correct format",
          });
          return;
        }

        // Handle duplicate email
        if (result.errorType === "duplicate_email") {
          form.setError("email", {
            type: "server",
            message: "This email has already been registered",
          });
          toast.error("📧 Email already registered", {
            description:
              "Please use a different email or contact the club board if you registered before.",
            duration: 6000,
          });
          return;
        }

        // Handle duplicate student ID
        if (result.errorType === "duplicate_ma_sinh_vien") {
          form.setError("ma_sinh_vien", {
            type: "server",
            message: "This student ID has already been registered",
          });
          toast.error("🆔 Student ID already registered", {
            description:
              "Please verify your student ID or contact the club board.",
            duration: 6000,
          });
          return;
        }

        throw new Error(result.message || "Registration failed");
      }

      // Dismiss loading toast
      toast.dismiss("submitting-form");

      // Success message
      toast.success("🎉 Registration successful!", {
        description: `Hello ${data.ho_ten}! We have received your application. The club board will review and contact you via ${data.email} within 3–5 business days.`,
        duration: 8000,
      });

      // Reset form sau khi thành công
      form.reset();

      // Scroll lên đầu trang để người dùng thấy thông báo
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      // Dismiss loading toast
      toast.dismiss("submitting-form");

      // Handle various errors
      if (error instanceof TypeError && error.message.includes("fetch")) {
        // Network error
        toast.error("🌐 Network error", {
          description:
            "Cannot connect to the server. Please check your internet and try again.",
          duration: 6000,
        });
      } else if (error instanceof Error) {
        // Server or validation error
        if (error.message.includes("Failed to fetch")) {
          toast.error("🔌 Cannot connect", {
            description:
              "The server is under maintenance or unavailable. Please try again later.",
            duration: 6000,
          });
        } else if (error.message.includes("timeout")) {
          toast.error("⏰ Request timed out", {
            description:
              "Your request took too long to process. Please try again.",
            duration: 5000,
          });
        } else {
          toast.error("❌ Registration failed", {
            description:
              error.message ||
              "An error occurred during processing. Please try again later.",
            duration: 6000,
          });
        }
      } else {
        // Unknown error
        toast.error("⚠️ Unknown error", {
          description:
            "An unexpected error occurred. Refresh the page and try again, or contact the club board if the issue persists.",
          duration: 7000,
        });
      }

      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Banner */}
      <section className="relative w-full h-[300px] bg-gradient-to-r from-[#004987] to-[#0070b8] overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-cover bg-center" />
        </div>
        <div className="container relative z-10 h-full flex flex-col items-center justify-center text-white text-center px-4 md:px-6">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Join the Club
          </h1>
          <p className="text-lg max-w-2xl">
            Become a member of the Blockchain Pioneer Student Club and start
            your journey exploring breakthrough technology
          </p>
        </div>
      </section>

      {/* Why Join */}
      <section className="py-16 bg-white">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#004987] mb-4">
              Why join the club?
            </h2>
            <div className="w-20 h-1 bg-[#004987] mx-auto mb-6"></div>
            <p className="max-w-3xl mx-auto text-gray-600">
              Joining the Blockchain Pioneer Student Club brings you
              opportunities to learn, grow, and connect.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-[#004987]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-[#004987]" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-[#004987]">
                Learning & Growth
              </h3>
              <p className="text-gray-600">
                Access the latest Blockchain & Web3 knowledge via workshops,
                seminars, and expert-led courses.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-[#004987]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-[#004987]" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-[#004987]">
                Community & Networking
              </h3>
              <p className="text-gray-600">
                Meet and connect with students, professionals, and companies in
                Blockchain and tech.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-[#004987]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-[#004987]" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-[#004987]">
                Career opportunities
              </h3>
              <p className="text-gray-600">
                Access internships, jobs, and real-world projects from our
                industry partners.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Registration Form */}
      <section className="py-16 bg-gray-50">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#004987] mb-4">
              Registration
            </h2>
            <div className="w-20 h-1 bg-[#004987] mx-auto mb-6"></div>
            <p className="max-w-3xl mx-auto text-gray-600">
              Fill in the form below to apply for membership in the Blockchain
              Pioneer Student Club
            </p>
          </div>

          <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6 md:p-8">
            {/* Notice */}
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="text-sm font-semibold text-blue-800 mb-2">
                📝 Form guidelines
              </h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Fields marked * are required</li>
                <li>• Please provide accurate information</li>
                <li>
                  • You will receive a confirmation email after submission
                </li>
                <li>• The board will contact you within 3–5 business days</li>
                <li>• If issues occur, check your connection and retry</li>
              </ul>
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-[#004987]">
                    Personal information
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="ho_ten"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full name *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., John Doe"
                              {...field}
                              onChange={(e) => {
                                field.onChange(e.target.value);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="ma_sinh_vien"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Student ID *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., 2021001234"
                              {...field}
                              onChange={(e) => {
                                // Chỉ cho phép chữ cái và số
                                const value = e.target.value.replace(
                                  /[^A-Za-z0-9]/g,
                                  ""
                                );
                                field.onChange(value);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email *</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="Ví dụ: nguyenvana@email.com"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="so_dien_thoai"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone (optional)</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., 0123456789 or +84 123 456 789"
                              {...field}
                              onChange={(e) => {
                                // Chỉ cho phép số, dấu +, -, (), khoảng trắng
                                const value = e.target.value.replace(
                                  /[^0-9+\-\s()]/g,
                                  ""
                                );
                                field.onChange(value);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="truong"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>University/Organization *</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select your university/organization" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="truong_dai_hoc_bach_khoa_ha_noi">
                              Hanoi University of Science and Technology
                            </SelectItem>
                            <SelectItem value="truong_dai_hoc_ngoai_thuong">
                              Foreign Trade University
                            </SelectItem>
                            <SelectItem value="truong_dai_hoc_kinh_te_quoc_dan">
                              National Economics University
                            </SelectItem>
                            <SelectItem value="truong_dai_hoc_giao_thong_van_tai">
                              University of Transport and Communications
                            </SelectItem>
                            <SelectItem value="truong_dai_hoc_fpt">
                              FPT University
                            </SelectItem>
                            <SelectItem value="truong_dai_hoc_ha_noi">
                              Hanoi University
                            </SelectItem>
                            <SelectItem value="truong_dai_hoc_huflit">
                              HUFLIT University
                            </SelectItem>
                            <SelectItem value="truong_dai_hoc_ton_duc_thang">
                              Ton Duc Thang University
                            </SelectItem>
                            <SelectItem value="truong_dai_hoc_van_lang">
                              Van Lang University
                            </SelectItem>
                            <SelectItem value="truong_dai_hoc_cong_nghe_dhqg_ha_noi">
                              University of Engineering and Technology – VNU
                              Hanoi
                            </SelectItem>
                            <SelectItem value="truong_dai_hoc_bach_khoa_tp_hcm">
                              Ho Chi Minh City University of Technology – VNU
                              HCMC
                            </SelectItem>
                            <SelectItem value="truong_dai_hoc_cong_nghiep_ha_noi">
                              Hanoi University of Industry
                            </SelectItem>
                            <SelectItem value="truong_dai_hoc_cong_nghiep_tp_hcm">
                              Industrial University of Ho Chi Minh City
                            </SelectItem>
                            <SelectItem value="hoc_vien_cong_nghe_buu_chinh_vien_thong">
                              Posts and Telecommunications Institute of
                              Technology
                            </SelectItem>
                            <SelectItem value="truong_dai_hoc_su_pham_ky_thuat_tp_hcm">
                              HCMC University of Technology and Education
                            </SelectItem>
                            <SelectItem value="truong_dai_hoc_su_pham_ky_thuat_vinh_long">
                              Vinh Long University of Technology Education
                            </SelectItem>
                            <SelectItem value="truong_dai_hoc_cong_nghe_thong_tin_dhqg_tp_hcm">
                              University of Information Technology – VNU HCMC
                            </SelectItem>
                            <SelectItem value="truong_dai_hoc_cong_nghe_giao_thong_van_tai">
                              University of Transport Technology
                            </SelectItem>
                            <SelectItem value="truong_dai_hoc_ky_thuat_cong_nghiep_thai_nguyen">
                              Thai Nguyen University of Technology
                            </SelectItem>

                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="khoa_nganh"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Faculty/Major *</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select your faculty/major" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="cntt">
                              Information Technology
                            </SelectItem>
                            <SelectItem value="dtvt">
                              Electronics & Telecommunications
                            </SelectItem>
                            <SelectItem value="ktxd">
                              Civil Engineering
                            </SelectItem>
                            <SelectItem value="ktct">
                              Transport Economics
                            </SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="nam_hoc"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Year of study *</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select your year" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="1">Year 1</SelectItem>
                            <SelectItem value="2">Year 2</SelectItem>
                            <SelectItem value="3">Year 3</SelectItem>
                            <SelectItem value="4">Year 4</SelectItem>
                            <SelectItem value="5">Year 5</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-[#004987]">
                    Additional information
                  </h3>

                  <FormField
                    control={form.control}
                    name="linh_vuc_quan_tam"
                    render={() => (
                      <FormItem>
                        <FormLabel>
                          Which Blockchain areas are you interested in? *
                        </FormLabel>
                        <p className="text-sm text-gray-500 mb-2">
                          Select at least 1 and at most 6 areas
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {[
                            {
                              id: "dev",
                              label: "Development",
                              value: "dev",
                            },
                            {
                              id: "research",
                              label: "Research",
                              value: "research",
                            },
                            {
                              id: "defi",
                              label: "DeFi",
                              value: "defi",
                            },
                            {
                              id: "nft",
                              label: "NFT & Metaverse",
                              value: "nft",
                            },
                            {
                              id: "trading",
                              label: "Trading",
                              value: "trading",
                            },
                            { id: "other", label: "Other", value: "other" },
                          ].map((item) => (
                            <FormField
                              key={item.id}
                              control={form.control}
                              name="linh_vuc_quan_tam"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={item.id}
                                    className="flex flex-row items-start space-x-3 space-y-0"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(
                                          item.value
                                        )}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([
                                                ...field.value,
                                                item.value,
                                              ])
                                            : field.onChange(
                                                field.value?.filter(
                                                  (value) =>
                                                    value !== item.value
                                                )
                                              );
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      {item.label}
                                    </FormLabel>
                                  </FormItem>
                                );
                              }}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="ban_tham_gia"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>
                          Which division do you want to join? *
                        </FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-1"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="ban_ky_thuat" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Technical Department
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="ban_truyen_thong" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Communications Department
                              </FormLabel>
                            </FormItem>

                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="ban_noi_bo" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Logistics Department
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="ban_quan_he_doi_tac_tai_tro" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Partnerships & Sponsorships Department
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="kinh_nghiem_blockchain"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Blockchain experience (optional)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe your experience with Blockchain..."
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="ly_do_tham_gia"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Why do you want to join? *</FormLabel>
                        <p className="text-sm text-gray-500 mb-2">
                          Write at least 10 characters to share your reason.
                        </p>
                        <FormControl>
                          <Textarea
                            placeholder="Share why you want to join the Blockchain Pioneer Student Club..."
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[#004987] hover:bg-[#003b6d]"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Processing..." : "Submit application"}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-white">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#004987] mb-4">
              Frequently Asked Questions
            </h2>
            <div className="w-20 h-1 bg-[#004987] mx-auto mb-6"></div>
          </div>

          <div className="max-w-3xl mx-auto space-y-6">
            {[
              {
                question: "Who can join the Blockchain Pioneer Student Club?",
                answer:
                  "All students at the University of Transport and Communications can apply, regardless of faculty, major, or year.",
              },
              {
                question: "Do I need prior Blockchain knowledge?",
                answer:
                  "No. We welcome all passionate students. We offer courses and workshops from beginner to advanced levels.",
              },
              {
                question: "What is the registration process?",
                answer:
                  "Fill out the online application form. The board will review and may contact you for a short interview. You will receive the result via email.",
              },
              {
                question: "Is there a membership fee?",
                answer:
                  "There is a small annual membership fee to sustain activities and events. Fee waivers may be available for students in need.",
              },
            ].map((faq, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-[#004987] mb-2">
                  {faq.question}
                </h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="#">
              <Button
                variant="outline"
                className="text-[#004987] border-[#004987] hover:bg-[#004987] hover:text-white"
              >
                View all questions
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
