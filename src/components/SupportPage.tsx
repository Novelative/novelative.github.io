import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Bug,
  ChevronDown,
  KeyRound,
  Lightbulb,
  Mail,
  MessageCircle,
  Send,
} from "lucide-react";
import { ParticleCanvas, reveal } from "./shared";

const supportSubjects = [
  { label: "General Inquiry", icon: MessageCircle },
  { label: "Bug Report", icon: Bug },
  { label: "Feature Request", icon: Lightbulb },
  { label: "Licensing Issue", icon: KeyRound },
];

export function SupportPage() {
  const shouldReduceMotion = useReducedMotion();
  const formRef = useRef<HTMLFormElement | null>(null);
  const [selectedSubject, setSelectedSubject] = useState(supportSubjects[0]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [submitState, setSubmitState] = useState<
    "idle" | "sending" | "sent" | "failed"
  >("idle");
  const SelectedSubjectIcon = selectedSubject.icon;

  useEffect(() => {
    if (
      document.querySelector(
        'script[src="https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js"]',
      )
    ) {
      return;
    }

    const script = document.createElement("script");
    script.src =
      "https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js";
    script.async = true;
    script.onload = () => {
      (
        window as unknown as {
          emailjs?: { init: (config: { publicKey: string }) => void };
        }
      ).emailjs?.init({ publicKey: "7Lq-JMbXtVbwLCluy" });
    };
    document.body.appendChild(script);
  }, []);

  const copySupportEmail = async () => {
    await navigator.clipboard.writeText("support@novelative.com");
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  const submitContactForm = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formRef.current || submitState === "sending") return;

    setSubmitState("sending");

    try {
      const emailjs = (
        window as unknown as {
          emailjs?: {
            sendForm: (
              serviceId: string,
              templateId: string,
              form: HTMLFormElement,
            ) => Promise<unknown>;
          };
        }
      ).emailjs;

      if (!emailjs) {
        throw new Error("EmailJS is not ready yet.");
      }

      await emailjs.sendForm("service_ixkkajg", "template_u2gzusr", formRef.current);
      formRef.current.reset();
      setSelectedSubject(supportSubjects[0]);
      setSubmitState("sent");
    } catch {
      setSubmitState("failed");
    } finally {
      window.setTimeout(() => setSubmitState("idle"), 6000);
    }
  };

  return (
    <section className="support-page">
      {!shouldReduceMotion && <ParticleCanvas />}
      <div className="support-gradient" />
      <div className="container support-page-inner">
        <motion.div
          className="support-hero-copy"
          initial="hidden"
          animate="show"
          variants={reveal}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <h1>Support & Contact</h1>
          <p>
            Questions about downloads, licensing, the beta workflow, or bug
            reports all start here.
          </p>
        </motion.div>

        <section className="support-panel">
          <div className="support-copy">
            <h2>How can we help?</h2>
            <p>
              We are a small, dedicated team building the best tool for
              novelists. We try to respond to all inquiries within 24-48 hours.
            </p>

            <div className="support-method-list">
              <div className="support-method">
                <span>
                  <Mail size={24} />
                </span>
                <div>
                  <h3>Email Support</h3>
                  <p>For general inquiries and license issues.</p>
                  <button type="button" onClick={copySupportEmail}>
                    support@novelative.com
                    <em className={copied ? "visible" : ""}>Copied!</em>
                  </button>
                </div>
              </div>

              <div className="support-method blue">
                <span>
                  <MessageCircle size={24} />
                </span>
                <div>
                  <h3>Community Discord</h3>
                  <p>Join other writers, report bugs, and suggest features.</p>
                  <a
                    href="https://discord.gg/TUyzpVTXUS"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Join the Server
                  </a>
                </div>
              </div>
            </div>
          </div>

          <form
            ref={formRef}
            className="support-form"
            onSubmit={submitContactForm}
          >
            <div className="support-form-grid">
              <label>
                <span>Name</span>
                <input name="name" required placeholder="Jane Doe" />
              </label>
              <label>
                <span>Email</span>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="jane@example.com"
                />
              </label>
            </div>

            <div className="support-subject-control">
              <span>Subject</span>
              <button
                type="button"
                className={dropdownOpen ? "open" : ""}
                onClick={() => setDropdownOpen((open) => !open)}
              >
                <span>
                  <SelectedSubjectIcon size={18} />
                  {selectedSubject.label}
                </span>
                <ChevronDown size={18} />
              </button>
              <input
                type="hidden"
                name="subject"
                value={selectedSubject.label}
              />
              {dropdownOpen && (
                <div className="support-subject-menu">
                  {supportSubjects.map((subject) => (
                    <SubjectMenuButton
                      key={subject.label}
                      subject={subject}
                      onClick={() => {
                        setSelectedSubject(subject);
                        setDropdownOpen(false);
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            <label>
              <span>Message</span>
              <textarea
                name="message"
                rows={5}
                required
                placeholder="How can we help you?"
              />
            </label>

            <button
              type="submit"
              className={`support-submit ${submitState}`}
              disabled={submitState === "sending"}
            >
              <Send size={18} />
              {submitState === "sending"
                ? "Sending..."
                : submitState === "sent"
                  ? "Message Sent!"
                  : submitState === "failed"
                    ? "Failed to Send"
                    : "Send Message"}
            </button>
          </form>
        </section>
      </div>
    </section>
  );
}

function SubjectMenuButton({
  subject,
  onClick,
}: {
  subject: (typeof supportSubjects)[number];
  onClick: () => void;
}) {
  const Icon = subject.icon;

  return (
    <button type="button" onClick={onClick}>
      <Icon size={18} />
      {subject.label}
    </button>
  );
}
