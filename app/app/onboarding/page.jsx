"use client";

import { useState, useEffect } from "react";
import useUser from "@/utils/useUser";
import {
  User,
  Briefcase,
  Users,
  Building2,
  Check,
  ArrowRight,
  Loader2,
} from "lucide-react";

const COUNTRIES = [
  { name: "Afghanistan", dial_code: "+93", code: "AF" },
  { name: "Albania", dial_code: "+355", code: "AL" },
  { name: "Algeria", dial_code: "+213", code: "DZ" },
  { name: "Andorra", dial_code: "+376", code: "AD" },
  { name: "Angola", dial_code: "+244", code: "AO" },
  { name: "Antigua and Barbuda", dial_code: "+1268", code: "AG" },
  { name: "Argentina", dial_code: "+54", code: "AR" },
  { name: "Armenia", dial_code: "+374", code: "AM" },
  { name: "Australia", dial_code: "+61", code: "AU" },
  { name: "Austria", dial_code: "+43", code: "AT" },
  { name: "Azerbaijan", dial_code: "+994", code: "AZ" },
  { name: "Bahamas", dial_code: "+1242", code: "BS" },
  { name: "Bahrain", dial_code: "+973", code: "BH" },
  { name: "Bangladesh", dial_code: "+880", code: "BD" },
  { name: "Barbados", dial_code: "+1246", code: "BB" },
  { name: "Belarus", dial_code: "+375", code: "BY" },
  { name: "Belgium", dial_code: "+32", code: "BE" },
  { name: "Belize", dial_code: "+501", code: "BZ" },
  { name: "Benin", dial_code: "+229", code: "BJ" },
  { name: "Bhutan", dial_code: "+975", code: "BT" },
  { name: "Bolivia", dial_code: "+591", code: "BO" },
  { name: "Bosnia and Herzegovina", dial_code: "+387", code: "BA" },
  { name: "Botswana", dial_code: "+267", code: "BW" },
  { name: "Brazil", dial_code: "+55", code: "BR" },
  { name: "Brunei", dial_code: "+673", code: "BN" },
  { name: "Bulgaria", dial_code: "+359", code: "BG" },
  { name: "Burkina Faso", dial_code: "+226", code: "BF" },
  { name: "Burundi", dial_code: "+257", code: "BI" },
  { name: "Cabo Verde", dial_code: "+238", code: "CV" },
  { name: "Cambodia", dial_code: "+855", code: "KH" },
  { name: "Cameroon", dial_code: "+237", code: "CM" },
  { name: "Canada", dial_code: "+1", code: "CA" },
  { name: "Central African Republic", dial_code: "+236", code: "CF" },
  { name: "Chad", dial_code: "+235", code: "TD" },
  { name: "Chile", dial_code: "+56", code: "CL" },
  { name: "China", dial_code: "+86", code: "CN" },
  { name: "Colombia", dial_code: "+57", code: "CO" },
  { name: "Comoros", dial_code: "+269", code: "KM" },
  { name: "Congo", dial_code: "+242", code: "CG" },
  { name: "Costa Rica", dial_code: "+506", code: "CR" },
  { name: "Croatia", dial_code: "+385", code: "HR" },
  { name: "Cuba", dial_code: "+53", code: "CU" },
  { name: "Cyprus", dial_code: "+357", code: "CY" },
  { name: "Czech Republic", dial_code: "+420", code: "CZ" },
  { name: "Denmark", dial_code: "+45", code: "DK" },
  { name: "Djibouti", dial_code: "+253", code: "DJ" },
  { name: "Dominica", dial_code: "+1767", code: "DM" },
  { name: "Dominican Republic", dial_code: "+1809", code: "DO" },
  { name: "Ecuador", dial_code: "+593", code: "EC" },
  { name: "Egypt", dial_code: "+20", code: "EG" },
  { name: "El Salvador", dial_code: "+503", code: "SV" },
  { name: "Equatorial Guinea", dial_code: "+240", code: "GQ" },
  { name: "Eritrea", dial_code: "+291", code: "ER" },
  { name: "Estonia", dial_code: "+372", code: "EE" },
  { name: "Eswatini", dial_code: "+268", code: "SZ" },
  { name: "Ethiopia", dial_code: "+251", code: "ET" },
  { name: "Fiji", dial_code: "+679", code: "FJ" },
  { name: "Finland", dial_code: "+358", code: "FI" },
  { name: "France", dial_code: "+33", code: "FR" },
  { name: "Gabon", dial_code: "+241", code: "GA" },
  { name: "Gambia", dial_code: "+220", code: "GM" },
  { name: "Georgia", dial_code: "+995", code: "GE" },
  { name: "Germany", dial_code: "+49", code: "DE" },
  { name: "Ghana", dial_code: "+233", code: "GH" },
  { name: "Greece", dial_code: "+30", code: "GR" },
  { name: "Grenada", dial_code: "+1473", code: "GD" },
  { name: "Guatemala", dial_code: "+502", code: "GT" },
  { name: "Guinea", dial_code: "+224", code: "GN" },
  { name: "Guinea-Bissau", dial_code: "+245", code: "GW" },
  { name: "Guyana", dial_code: "+592", code: "GY" },
  { name: "Haiti", dial_code: "+509", code: "HT" },
  { name: "Honduras", dial_code: "+504", code: "HN" },
  { name: "Hungary", dial_code: "+36", code: "HU" },
  { name: "Iceland", dial_code: "+354", code: "IS" },
  { name: "India", dial_code: "+91", code: "IN" },
  { name: "Indonesia", dial_code: "+62", code: "ID" },
  { name: "Iran", dial_code: "+98", code: "IR" },
  { name: "Iraq", dial_code: "+964", code: "IQ" },
  { name: "Ireland", dial_code: "+353", code: "IE" },
  { name: "Israel", dial_code: "+972", code: "IL" },
  { name: "Italy", dial_code: "+39", code: "IT" },
  { name: "Ivory Coast", dial_code: "+225", code: "CI" },
  { name: "Jamaica", dial_code: "+1876", code: "JM" },
  { name: "Japan", dial_code: "+81", code: "JP" },
  { name: "Jordan", dial_code: "+962", code: "JO" },
  { name: "Kazakhstan", dial_code: "+7", code: "KZ" },
  { name: "Kenya", dial_code: "+254", code: "KE" },
  { name: "Kiribati", dial_code: "+686", code: "KI" },
  { name: "Kuwait", dial_code: "+965", code: "KW" },
  { name: "Kyrgyzstan", dial_code: "+996", code: "KG" },
  { name: "Laos", dial_code: "+856", code: "LA" },
  { name: "Latvia", dial_code: "+371", code: "LV" },
  { name: "Lebanon", dial_code: "+961", code: "LB" },
  { name: "Lesotho", dial_code: "+266", code: "LS" },
  { name: "Liberia", dial_code: "+231", code: "LR" },
  { name: "Libya", dial_code: "+218", code: "LY" },
  { name: "Liechtenstein", dial_code: "+423", code: "LI" },
  { name: "Lithuania", dial_code: "+370", code: "LT" },
  { name: "Luxembourg", dial_code: "+352", code: "LU" },
  { name: "Madagascar", dial_code: "+261", code: "MG" },
  { name: "Malawi", dial_code: "+265", code: "MW" },
  { name: "Malaysia", dial_code: "+60", code: "MY" },
  { name: "Maldives", dial_code: "+960", code: "MV" },
  { name: "Mali", dial_code: "+223", code: "ML" },
  { name: "Malta", dial_code: "+356", code: "MT" },
  { name: "Marshall Islands", dial_code: "+692", code: "MH" },
  { name: "Mauritania", dial_code: "+222", code: "MR" },
  { name: "Mauritius", dial_code: "+230", code: "MU" },
  { name: "Mexico", dial_code: "+52", code: "MX" },
  { name: "Micronesia", dial_code: "+691", code: "FM" },
  { name: "Moldova", dial_code: "+373", code: "MD" },
  { name: "Monaco", dial_code: "+377", code: "MC" },
  { name: "Mongolia", dial_code: "+976", code: "MN" },
  { name: "Montenegro", dial_code: "+382", code: "ME" },
  { name: "Morocco", dial_code: "+212", code: "MA" },
  { name: "Mozambique", dial_code: "+258", code: "MZ" },
  { name: "Myanmar", dial_code: "+95", code: "MM" },
  { name: "Namibia", dial_code: "+264", code: "NA" },
  { name: "Nauru", dial_code: "+674", code: "NR" },
  { name: "Nepal", dial_code: "+977", code: "NP" },
  { name: "Netherlands", dial_code: "+31", code: "NL" },
  { name: "New Zealand", dial_code: "+64", code: "NZ" },
  { name: "Nicaragua", dial_code: "+505", code: "NI" },
  { name: "Niger", dial_code: "+227", code: "NE" },
  { name: "Nigeria", dial_code: "+234", code: "NG" },
  { name: "North Korea", dial_code: "+850", code: "KP" },
  { name: "North Macedonia", dial_code: "+389", code: "MK" },
  { name: "Norway", dial_code: "+47", code: "NO" },
  { name: "Oman", dial_code: "+968", code: "OM" },
  { name: "Pakistan", dial_code: "+92", code: "PK" },
  { name: "Palau", dial_code: "+680", code: "PW" },
  { name: "Palestine", dial_code: "+970", code: "PS" },
  { name: "Panama", dial_code: "+507", code: "PA" },
  { name: "Papua New Guinea", dial_code: "+675", code: "PG" },
  { name: "Paraguay", dial_code: "+595", code: "PY" },
  { name: "Peru", dial_code: "+51", code: "PE" },
  { name: "Philippines", dial_code: "+63", code: "PH" },
  { name: "Poland", dial_code: "+48", code: "PL" },
  { name: "Portugal", dial_code: "+351", code: "PT" },
  { name: "Qatar", dial_code: "+974", code: "QA" },
  { name: "Romania", dial_code: "+40", code: "RO" },
  { name: "Russia", dial_code: "+7", code: "RU" },
  { name: "Rwanda", dial_code: "+250", code: "RW" },
  { name: "Saint Kitts and Nevis", dial_code: "+1869", code: "KN" },
  { name: "Saint Lucia", dial_code: "+1758", code: "LC" },
  { name: "Saint Vincent and the Grenadines", dial_code: "+1784", code: "VC" },
  { name: "Samoa", dial_code: "+685", code: "WS" },
  { name: "San Marino", dial_code: "+378", code: "SM" },
  { name: "Sao Tome and Principe", dial_code: "+239", code: "ST" },
  { name: "Saudi Arabia", dial_code: "+966", code: "SA" },
  { name: "Senegal", dial_code: "+221", code: "SN" },
  { name: "Serbia", dial_code: "+381", code: "RS" },
  { name: "Seychelles", dial_code: "+248", code: "SC" },
  { name: "Sierra Leone", dial_code: "+232", code: "SL" },
  { name: "Singapore", dial_code: "+65", code: "SG" },
  { name: "Slovakia", dial_code: "+421", code: "SK" },
  { name: "Slovenia", dial_code: "+386", code: "SI" },
  { name: "Solomon Islands", dial_code: "+677", code: "SB" },
  { name: "Somalia", dial_code: "+252", code: "SO" },
  { name: "South Africa", dial_code: "+27", code: "ZA" },
  { name: "South Korea", dial_code: "+82", code: "KR" },
  { name: "South Sudan", dial_code: "+211", code: "SS" },
  { name: "Spain", dial_code: "+34", code: "ES" },
  { name: "Sri Lanka", dial_code: "+94", code: "LK" },
  { name: "Sudan", dial_code: "+249", code: "SD" },
  { name: "Suriname", dial_code: "+597", code: "SR" },
  { name: "Sweden", dial_code: "+46", code: "SE" },
  { name: "Switzerland", dial_code: "+41", code: "CH" },
  { name: "Syria", dial_code: "+963", code: "SY" },
  { name: "Taiwan", dial_code: "+886", code: "TW" },
  { name: "Tajikistan", dial_code: "+992", code: "TJ" },
  { name: "Tanzania", dial_code: "+255", code: "TZ" },
  { name: "Thailand", dial_code: "+66", code: "TH" },
  { name: "Timor-Leste", dial_code: "+670", code: "TL" },
  { name: "Togo", dial_code: "+228", code: "TG" },
  { name: "Tonga", dial_code: "+676", code: "TO" },
  { name: "Trinidad and Tobago", dial_code: "+1868", code: "TT" },
  { name: "Tunisia", dial_code: "+216", code: "TN" },
  { name: "Turkey", dial_code: "+90", code: "TR" },
  { name: "Turkmenistan", dial_code: "+993", code: "TM" },
  { name: "Tuvalu", dial_code: "+688", code: "TV" },
  { name: "Uganda", dial_code: "+256", code: "UG" },
  { name: "Ukraine", dial_code: "+380", code: "UA" },
  { name: "United Arab Emirates", dial_code: "+971", code: "AE" },
  { name: "United Kingdom", dial_code: "+44", code: "GB" },
  { name: "United States", dial_code: "+1", code: "US" },
  { name: "Uruguay", dial_code: "+598", code: "UY" },
  { name: "Uzbekistan", dial_code: "+998", code: "UZ" },
  { name: "Vanuatu", dial_code: "+678", code: "VU" },
  { name: "Vatican City", dial_code: "+379", code: "VA" },
  { name: "Venezuela", dial_code: "+58", code: "VE" },
  { name: "Vietnam", dial_code: "+84", code: "VN" },
  { name: "Yemen", dial_code: "+967", code: "YE" },
  { name: "Zambia", dial_code: "+260", code: "ZM" },
  { name: "Zimbabwe", dial_code: "+263", code: "ZW" },
].sort((a, b) => a.name.localeCompare(b.name));

export default function OnboardingPage() {
  const { data: user, loading: userLoading, refetch } = useUser();

  const [step, setStep] = useState(1);
  const [role, setRole] = useState(""); // user, worker, mixed, organization
  const [country, setCountry] = useState("");
  const [phoneCode, setPhoneCode] = useState("");
  const [phone, setPhone] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [nextUrl, setNextUrl] = useState("/");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const next = params.get("next");
      if (next) setNextUrl(next);
    }
  }, []);

  // Redirect if not logged in
  useEffect(() => {
    if (!userLoading && !user) {
      if (typeof window !== "undefined") {
        window.location.href = `/account/signin?callbackUrl=${encodeURIComponent("/onboarding")}`;
      }
    }
  }, [user, userLoading]);

  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole);
    setError("");
  };

  const handleNext = () => {
    if (step === 1) {
      if (!role) {
        setError("Please select how you want to use Grapper.");
        return;
      }
      setStep(2);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!country || !phone) {
      setError("Please fill in all fields.");
      return;
    }
    if (role === "organization" && !organizationName) {
      setError("Please enter your organization name.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const payload = {
        account_type: role,
        country,
        phone_number: `${phoneCode} ${phone}`,
      };

      if (role === "organization" && organizationName) {
        payload.full_name = organizationName;
      }

      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Failed to update profile");
      }

      // Refresh user data
      await refetch();

      // Go to next destination
      if (typeof window !== "undefined") {
        window.location.href = nextUrl;
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  };

  if (userLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-[#0F4241]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        {/* Progress */}
        <div className="mb-8 flex items-center justify-center space-x-4">
          <div
            className={`h-2.5 w-2.5 rounded-full ${step >= 1 ? "bg-[#0F4241]" : "bg-gray-300"}`}
          />
          <div
            className={`h-1 w-16 rounded-full ${step >= 2 ? "bg-[#0F4241]" : "bg-gray-200"}`}
          />
          <div
            className={`h-2.5 w-2.5 rounded-full ${step >= 2 ? "bg-[#0F4241]" : "bg-gray-300"}`}
          />
        </div>

        <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200">
          <div className="p-8">
            {step === 1 ? (
              <div className="space-y-6">
                <div className="text-center">
                  <h1 className="text-2xl font-bold text-gray-900">
                    Welcome to Grapper!
                  </h1>
                  <p className="mt-2 text-gray-600">
                    How would you like to use the platform?
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <RoleCard
                    icon={User}
                    title="User"
                    description="I want to hire talent and services."
                    active={role === "user"}
                    onClick={() => handleRoleSelect("user")}
                  />
                  <RoleCard
                    icon={Briefcase}
                    title="Worker"
                    description="I want to offer my services and find work."
                    active={role === "worker"}
                    onClick={() => handleRoleSelect("worker")}
                  />
                  <RoleCard
                    icon={Users}
                    title="User & Worker"
                    description="I want to both hire and work."
                    active={role === "mixed"}
                    onClick={() => handleRoleSelect("mixed")}
                  />
                  <RoleCard
                    icon={Building2}
                    title="Organization"
                    description="I represent a company or organization."
                    active={role === "organization"}
                    onClick={() => handleRoleSelect("organization")}
                  />
                </div>

                {error && (
                  <p className="text-center text-sm text-red-600">{error}</p>
                )}

                <div className="pt-4">
                  <button
                    onClick={handleNext}
                    className="flex w-full items-center justify-center rounded-lg bg-[#0F4241] px-4 py-3 text-base font-semibold text-white transition hover:bg-[#0c3534]"
                  >
                    Continue <ArrowRight className="ml-2 h-4 w-4" />
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="text-center">
                  <h1 className="text-2xl font-bold text-gray-900">
                    Complete your profile
                  </h1>
                  <p className="mt-2 text-gray-600">
                    {role === "organization"
                      ? "Tell us about your organization."
                      : "Tell us a bit more about yourself."}
                  </p>
                </div>

                <div className="space-y-4">
                  {role === "organization" && (
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Organization Name
                      </label>
                      <input
                        required
                        type="text"
                        value={organizationName}
                        onChange={(e) => setOrganizationName(e.target.value)}
                        className="block w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-[#0F4241] focus:outline-none focus:ring-1 focus:ring-[#0F4241]"
                        placeholder="Company Ltd."
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Country
                    </label>
                    <select
                      required
                      value={country}
                      onChange={(e) => {
                        const selectedCountry = COUNTRIES.find(
                          (c) => c.name === e.target.value,
                        );
                        setCountry(selectedCountry.name);
                        setPhoneCode(selectedCountry.dial_code);
                      }}
                      className="block w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-[#0F4241] focus:outline-none focus:ring-1 focus:ring-[#0F4241]"
                    >
                      <option value="">Select your country</option>
                      {COUNTRIES.map((c) => (
                        <option key={c.code} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Phone Number
                    </label>
                    <div className="flex rounded-lg border border-gray-300 focus-within:border-[#0F4241] focus-within:ring-1 focus-within:ring-[#0F4241]">
                      <div className="flex min-w-[60px] items-center justify-center rounded-l-lg border-r border-gray-300 bg-gray-50 px-3 text-gray-600">
                        {phoneCode || "--"}
                      </div>
                      <input
                        required
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="block w-full flex-1 rounded-r-lg border-0 px-4 py-3 focus:outline-none focus:ring-0"
                        placeholder="123 456 7890"
                      />
                    </div>
                  </div>
                </div>

                {error && (
                  <p className="text-center text-sm text-red-600">{error}</p>
                )}

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-[2] rounded-lg bg-[#0F4241] px-4 py-3 text-base font-semibold text-white hover:bg-[#0c3534] disabled:opacity-70"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                        Saving...
                      </span>
                    ) : (
                      "Complete Setup"
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function RoleCard({ icon: Icon, title, description, active, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer rounded-xl border-2 p-4 transition-all ${
        active
          ? "border-[#0F4241] bg-[#0F4241]/5"
          : "border-gray-200 hover:border-[#0F4241]/50"
      }`}
    >
      <div className="flex items-start justify-between">
        <div
          className={`rounded-lg p-2 ${active ? "bg-[#0F4241] text-white" : "bg-gray-100 text-gray-600"}`}
        >
          <Icon size={24} />
        </div>
        {active && (
          <div className="rounded-full bg-[#0F4241] p-1 text-white">
            <Check size={12} />
          </div>
        )}
      </div>
      <h3 className="mt-4 font-semibold text-gray-900">{title}</h3>
      <p className="mt-1 text-sm text-gray-500">{description}</p>
    </div>
  );
}
