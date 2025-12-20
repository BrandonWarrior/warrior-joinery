export default function About() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <div className="grid gap-8 md:grid-cols-[220px_1fr] md:items-start">
        {/* Profile Image */}
        <div className="flex justify-center md:justify-start">
          <div className="rounded-full p-1 ring-1 ring-black/10 shadow-sm">
            <img
              src="/images/profile-pic.jpg"
              alt="Brandon Warrior – Founder of Warrior Joinery"
              className="h-44 w-44 rounded-full object-cover object-center"
              loading="lazy"
            />
          </div>
        </div>

        {/* About Content */}
        <div className="space-y-5">
          <h1 className="text-3xl font-semibold tracking-tight">
            About Warrior Joinery
          </h1>

          <p className="text-gray-700 leading-7">
            Hi, I’m Brandon, the founder of Warrior Joinery. I’m a multi-skilled
            joiner with over seven years of hands-on experience working across
            residential joinery, property refurbishments, and bespoke fitted
            interiors.
          </p>

          <p className="text-gray-700 leading-7">
            My background includes first and second fix joinery, fitted furniture,
            and fire door installation. I’ve worked on everything from lived-in
            family homes to larger, safety-critical projects where precision,
            organisation, and attention to detail really matter.
          </p>

          <p className="text-gray-700 leading-7">
            I’m reliable, approachable, and take pride in doing things properly —
            turning up when I say I will, communicating clearly, and treating
            every home with care and respect.
          </p>

          <p className="text-gray-700 leading-7">
            I also designed and built this website myself. Just like my joinery
            work, I prefer to understand the full process, pay attention to the
            details, and take pride in doing things properly from start to finish.
          </p>

          {/* Credibility Blocks */}
          <div className="grid gap-4 pt-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-black/10 p-4">
              <h3 className="font-medium">Experience</h3>
              <p className="mt-1 text-sm text-gray-700">
                Over 7 years’ experience in joinery and property refurbishments.
              </p>
            </div>

            <div className="rounded-2xl border border-black/10 p-4">
              <h3 className="font-medium">Qualifications</h3>
              <p className="mt-1 text-sm text-gray-700">
                NVQ Level 2 Joinery & Multi-Trade Repairs, Fire Door Installation (L2).
              </p>
            </div>

            <div className="rounded-2xl border border-black/10 p-4">
              <h3 className="font-medium">Approach</h3>
              <p className="mt-1 text-sm text-gray-700">
                Honest advice, tidy workmanship, and attention to detail.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
