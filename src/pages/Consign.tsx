import { useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  X,
  Upload,
  CheckCircle2,
  Loader2,
  AlertCircle,
  ArrowRight,
  ImageIcon,
} from "lucide-react";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import Seo from "@/components/seo/Seo";
import { cn } from "@/lib/utils";
import { api } from "@/lib/client";
import { uploadAPI } from "@/lib/uploadApi";

// ─── Types ────────────────────────────────────────────────────────────────────

interface UploadedImage {
  url: string;
  publicId: string;
  fileName: string;
}

// ─── Field wrapper ────────────────────────────────────────────────────────────

const inputCls =
  "w-full bg-transparent px-4 border-0 border-b border-hairline focus:border-[#C6A96B] focus:outline-none focus:ring-0 py-3 text-base placeholder:text-foreground/40 transition-colors";

function Field({
  label,
  error,
  required,
  children,
}: {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="block eyebrow mb-1">
        {label}
        {required && <span className="text-destructive ml-0.5">*</span>}
      </span>
      {children}
      {error && (
        <span className="block mt-1.5 text-xs text-destructive">{error}</span>
      )}
    </label>
  );
}

// ─── Static data ──────────────────────────────────────────────────────────────

const HOW_IT_WORKS: Array<{ title: string; desc: string }> = [
  {
    title: "Submit photos",
    desc: "Upload clear images of your items from multiple angles.",
  },
  {
    title: "We review",
    desc: "Our team evaluates each submission carefully within 3–5 days.",
  },
  {
    title: "We contact you",
    desc: "If interested, we'll discuss terms and next steps by email or phone.",
  },
];

const WHAT_WE_SEEK: string[] = [
  "Islamic and Mughal antiques",
  "Historic coins and numismatic pieces",
  "Vintage and period jewellery",
  "Museum-quality items in good condition",
];

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function Consign() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [uploadingCount, setUploadingCount] = useState(0);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    description: "",
    itemTitle: "",
    category: "",
    estimatedDate: "",
    condition: "",
    estimatedValue: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // ── Image upload ──────────────────────────────────────────────────────────

  const handleFilesSelected = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files ?? []);
      if (!files.length) return;

      // Reset input so selecting the same file again triggers onChange
      e.target.value = "";

      const slots = 10 - uploadedImages.length;
      const toUpload = files.slice(0, slots);

      if (files.length > slots) {
        toast.warning(`Only ${slots} slot(s) remaining. Extra files ignored.`);
      }

      setUploadingCount((n) => n + toUpload.length);

      await Promise.all(
        toUpload.map(async (file) => {
          try {
            const { url, publicId } = await uploadAPI.uploadFile(file);
            setUploadedImages((prev) => [
              ...prev,
              { url, publicId, fileName: file.name },
            ]);
            toast.success(`${file.name} uploaded`);
          } catch {
            toast.error(`Failed to upload ${file.name}`);
          } finally {
            setUploadingCount((n) => n - 1);
          }
        }),
      );
    },
    [uploadedImages.length],
  );

  const removeImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const remaining = Math.max(0, 10 - uploadedImages.length);
  const isUploading = uploadingCount > 0;

  // ── Form ──────────────────────────────────────────────────────────────────

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = (): boolean => {
    const next: Record<string, string> = {};
    if (!formData.firstName.trim()) next.firstName = "First name is required";
    if (!formData.lastName.trim()) next.lastName = "Last name is required";
    if (!formData.email.trim()) next.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      next.email = "Invalid email address";
    if (!formData.phone.trim()) next.phone = "Phone number is required";
    if (!formData.description.trim() || formData.description.length < 10)
      next.description = "Please provide at least 10 characters";
    if (uploadedImages.length === 0)
      next.images = "At least one image is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await api.submitConsignment({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address || undefined,
        description: formData.description,
        itemTitle: formData.itemTitle || undefined,
        category: formData.category || undefined,
        estimatedDate: formData.estimatedDate || undefined,
        condition: formData.condition || undefined,
        estimatedValue: formData.estimatedValue
          ? parseFloat(formData.estimatedValue)
          : undefined,
        images: uploadedImages.map(({ url, publicId }) => ({ url, publicId })),
      });
      setSubmitted(true);
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Could not submit. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Success state ─────────────────────────────────────────────────────────

  if (submitted) {
    return (
      <>
        <Seo
          title="Consign"
          description="Submit items for consignment to AATIQ"
        />
        <div className="container pt-28 md:pt-36">
          <Breadcrumbs items={[{ label: "Consign" }]} />
        </div>
        <div className="container py-20 md:py-32 text-center">
          <CheckCircle2
            className="h-16 w-16 mx-auto mb-8 text-[#C6A96B]"
            strokeWidth={1}
          />
          <h1 className="font-display text-4xl md:text-5xl mb-4">Thank you</h1>
          <p className="eyebrow-gold mb-6">Your submission has been received</p>
          <p className="text-lg text-foreground/70 max-w-xl mx-auto mb-10 leading-relaxed">
            We appreciate you thinking of AATIQ. Our team will review your
            consignment carefully and be in touch within 3–5 business days.
          </p>
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 font-mono text-sm uppercase tracking-[0.2em] border border-[#C6A96B] text-[#C6A96B] px-8 py-3 hover:bg-[#C6A96B] hover:text-[#0F0F0F] transition-all duration-300"
          >
            Return Home
            <ArrowRight className="h-3 w-3" strokeWidth={1.5} />
          </button>
        </div>
      </>
    );
  }

  // ── Form page ─────────────────────────────────────────────────────────────

  return (
    <>
      <Seo
        title="Consign"
        description="Submit items for consignment to AATIQ gallery"
      />

      <div className="container pt-28 md:pt-36">
        <Breadcrumbs items={[{ label: "Consign" }]} />
        <div className="mt-6 max-w-4xl">
          <p className="eyebrow-gold mb-3">Private Consignments</p>
          <h1 className="font-display text-5xl md:text-7xl leading-[0.92]">
            Consign with AATIQ
          </h1>
        </div>
        <div className="hairline mt-12" />
      </div>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="container py-16 md:py-24 grid lg:grid-cols-12 gap-16"
      >
        {/* ── Left: explainer ─────────────────────────────────────────── */}
        <div className="lg:col-span-5 space-y-10">
          <div>
            <p className="eyebrow-gold mb-4">How it works</p>
            <ol className="space-y-6">
              {HOW_IT_WORKS.map((step, i) => (
                <li key={i} className="flex gap-4">
                  <span className="font-mono text-xs uppercase tracking-widest text-[#C6A96B] pt-0.5 shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <p className="font-display text-lg">{step.title}</p>
                    <p className="text-sm text-foreground/60 mt-1">
                      {step.desc}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="border-l-2 border-[#C6A96B] pl-6">
            <p className="eyebrow-gold mb-3">What we look for</p>
            <ul className="space-y-2 text-sm text-foreground/70">
              {WHAT_WE_SEEK.map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-[#C6A96B]/60 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── Right: form ─────────────────────────────────────────────── */}
        <div className="lg:col-span-7">
          <div className="border border-hairline p-8 md:p-12 bg-card space-y-10">
            {/* Contact info */}
            <section className="space-y-5">
              <h2 className="font-display text-2xl">Your Details</h2>
              <div className="grid sm:grid-cols-2 gap-5">
                <Field label="First name" error={errors.firstName} required>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    autoComplete="given-name"
                    className={inputCls}
                  />
                </Field>
                <Field label="Last name" error={errors.lastName} required>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    autoComplete="family-name"
                    className={inputCls}
                  />
                </Field>
              </div>
              <div className="grid sm:grid-cols-2 gap-5">
                <Field label="Email" error={errors.email} required>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    autoComplete="email"
                    className={inputCls}
                  />
                </Field>
                <Field label="Phone" error={errors.phone} required>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    autoComplete="tel"
                    className={inputCls}
                  />
                </Field>
              </div>
              <Field label="Address (optional)" error={errors.address}>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  autoComplete="street-address"
                  className={inputCls}
                />
              </Field>
            </section>

            {/* Images */}
            <section className="space-y-4">
              <h2 className="font-display text-2xl">Photos</h2>
              <p className="text-sm text-foreground/60">
                Upload 1–10 clear images. Maximum 10 MB per image.
              </p>

              {errors.images && (
                <div className="flex gap-2 items-start p-3 bg-destructive/10 border border-destructive/30">
                  <AlertCircle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
                  <p className="text-xs text-destructive">{errors.images}</p>
                </div>
              )}

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleFilesSelected}
              />

              {/* Preview grid */}
              {uploadedImages.length > 0 && (
                <div className="grid grid-cols-3 gap-3">
                  {uploadedImages.map((img, idx) => (
                    <div key={idx} className="relative group">
                      <div className="aspect-square overflow-hidden bg-[#EDE5D8] ring-1 ring-[#C6A96B]/20">
                        <img
                          src={img.url}
                          alt={img.fileName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        aria-label="Remove image"
                        className="absolute top-1.5 right-1.5 p-1 bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                      <p className="text-[10px] text-foreground/40 mt-1 truncate">
                        {img.fileName}
                      </p>
                    </div>
                  ))}

                  {/* Uploading placeholders */}
                  {Array.from({ length: uploadingCount }).map((_, i) => (
                    <div
                      key={`uploading-${i}`}
                      className="aspect-square bg-[#EDE5D8] ring-1 ring-[#C6A96B]/20 flex items-center justify-center"
                    >
                      <Loader2 className="h-5 w-5 text-[#C6A96B] animate-spin" />
                    </div>
                  ))}
                </div>
              )}

              {/* Upload trigger */}
              {remaining > 0 && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className={cn(
                    "w-full py-8 border-2 border-dashed border-hairline transition-colors flex flex-col items-center justify-center gap-3",
                    !isUploading
                      ? "hover:border-[#C6A96B]/50 cursor-pointer"
                      : "opacity-50 cursor-not-allowed",
                  )}
                >
                  {isUploading ? (
                    <Loader2 className="h-5 w-5 text-foreground/40 animate-spin" />
                  ) : (
                    <Upload className="h-5 w-5 text-foreground/40" />
                  )}
                  <div className="text-center">
                    <p className="font-mono text-xs uppercase tracking-widest text-foreground/50">
                      {isUploading
                        ? `Uploading ${uploadingCount} file(s)…`
                        : "Click to upload"}
                    </p>
                    <p className="text-xs text-foreground/35 mt-1">
                      {uploadedImages.length}/{10} uploaded · {remaining}{" "}
                      remaining
                    </p>
                  </div>
                </button>
              )}

              {remaining === 0 && !isUploading && (
                <div className="flex items-center gap-2 text-xs text-foreground/50 font-mono uppercase tracking-widest">
                  <ImageIcon className="h-3.5 w-3.5 text-[#C6A96B]" />
                  Maximum 10 images reached
                </div>
              )}
            </section>

            {/* Item details */}
            <section className="space-y-5">
              <h2 className="font-display text-2xl">About the Item</h2>
              <Field label="Description" error={errors.description} required>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={5}
                  placeholder="Describe the item, its condition, any markings, provenance, etc."
                  className={cn(inputCls, "resize-none")}
                />
              </Field>
              <div className="grid sm:grid-cols-2 gap-5">
                <Field label="Item title (optional)">
                  <input
                    type="text"
                    name="itemTitle"
                    value={formData.itemTitle}
                    onChange={handleInputChange}
                    placeholder="e.g., Mughal Ruby Ring"
                    className={inputCls}
                  />
                </Field>
                <Field label="Category (optional)">
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className={inputCls + " appearance-none bg-primary"}
                  >
                    <option value="" className="bg-primary">
                      Select a category
                    </option>
                    <option className="bg-primary" value="Islamic Art">
                      Antiques
                    </option>
                    <option className="bg-primary" value="Coins">
                      Coins
                    </option>
                    <option className="bg-primary" value="Jewelry">
                      Jewellery
                    </option>
                    <option className="bg-primary" value="Other">
                      Other
                    </option>
                  </select>
                </Field>
              </div>
              <div className="grid sm:grid-cols-2 gap-5">
                <Field label="Estimated date (optional)">
                  <input
                    type="text"
                    name="estimatedDate"
                    value={formData.estimatedDate}
                    onChange={handleInputChange}
                    placeholder="e.g., 18th century"
                    className={inputCls}
                  />
                </Field>
                <Field label="Condition (optional)">
                  <select
                    name="condition"
                    value={formData.condition}
                    onChange={handleInputChange}
                    className={inputCls}
                  >
                    <option value="" className="bg-primary">
                      Select condition
                    </option>
                    <option value="Excellent" className="bg-primary">
                      Excellent
                    </option>
                    <option value="Good" className="bg-primary">
                      Good
                    </option>
                    <option value="Fair" className="bg-primary">
                      Fair
                    </option>
                    <option value="Poor" className="bg-primary">
                      Poor
                    </option>
                  </select>
                </Field>
              </div>
              <Field label="Estimated value in USD (optional)">
                <input
                  type="number"
                  name="estimatedValue"
                  value={formData.estimatedValue}
                  onChange={handleInputChange}
                  placeholder="e.g., 5000"
                  min={0}
                  className={inputCls}
                />
              </Field>
            </section>

            {/* Submit */}
            <div className="pt-2 space-y-4">
              <button
                type="submit"
                disabled={isSubmitting || isUploading}
                className="w-full font-mono text-[11px] uppercase tracking-widest bg-foreground text-background py-4 hover:bg-[#C6A96B] transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Submitting…
                  </>
                ) : (
                  "Submit Consignment"
                )}
              </button>
              <p className="font-mono text-xs uppercase tracking-widest text-foreground/40 text-center">
                We review all submissions within 3–5 business days
              </p>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}
