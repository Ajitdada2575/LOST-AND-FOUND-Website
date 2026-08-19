import { Link } from 'react-router-dom';
import './HowItWorks.css';

const CATEGORIES = [
  { id: 1, name: 'Mobile' },
  { id: 2, name: 'Wallet' },
  { id: 3, name: 'Money' },
  { id: 4, name: 'ID Card' },
  { id: 5, name: 'Bag' },
  { id: 6, name: 'Umbrella' },
  { id: 7, name: 'Watch' },
  { id: 8, name: 'Earbuds' },
];

const LOCATIONS = [
  { id: 1, name: 'Computer Lab 1' },
  { id: 2, name: 'Computer Lab 2' },
  { id: 3, name: 'ENTC Lab' },
  { id: 4, name: 'IT Lab' },
  { id: 5, name: 'Mechanical Lab' },
  { id: 6, name: 'Electrical Lab' },
  { id: 7, name: 'Electronics Lab' },
  { id: 8, name: 'Main Building' },
  { id: 9, name: 'College Library' },
  { id: 10, name: 'Sports Ground' },
  { id: 11, name: 'Student Affairs Office' },
  { id: 12, name: 'College Canteen' },
  { id: 13, name: 'Auditorium' },
  { id: 14, name: 'Parking Area' },
  { id: 15, name: 'Classroom Block' },
];

export default function HowItWorks() {
  return (
    <div className="page-how-it-works">
      {/* Hero */}
      <section className="hiw-hero">
        <div className="container">
          <span className="hiw-eyebrow" style={{ background: 'rgba(255,255,255,0.15)', color: 'white' }}>
            Guide
          </span>
          <h1>How It Works</h1>
          <p>
            A simple, step-by-step walkthrough of how the College Lost &amp; Found system helps
            students report, match, claim, and recover their belongings.
          </p>

          <div className="hiw-flow-chain">
            <span className="hiw-flow-step">🔍 Search / Discover</span>
            <span className="hiw-flow-arrow">→</span>
            <span className="hiw-flow-step">📋 Report</span>
            <span className="hiw-flow-arrow">→</span>
            <span className="hiw-flow-step">🔗 Match</span>
            <span className="hiw-flow-arrow">→</span>
            <span className="hiw-flow-step">✅ Claim</span>
            <span className="hiw-flow-arrow">→</span>
            <span className="hiw-flow-step">🔎 Verify</span>
            <span className="hiw-flow-arrow">→</span>
            <span className="hiw-flow-step">📦 Return</span>
          </div>
        </div>
      </section>

      <div className="container" style={{ paddingTop: 'var(--space-8)' }}>
        {/* SECTION 1 — OVERVIEW */}
        <section className="hiw-section">
          <span className="hiw-eyebrow">Overview</span>
          <h2 className="hiw-section-title">What this system does</h2>
          <p className="hiw-section-subtitle">
            This system allows students to report lost belongings, report items they have found,
            automatically identify potential matches, submit claims, and complete the recovery
            process — all in one place.
          </p>

          <div className="hiw-vertical-flow">
            <div className="hiw-vf-item">Student loses an item</div>
            <div className="hiw-vf-arrow">↓</div>
            <div className="hiw-vf-item">Reports Lost Item</div>
            <div className="hiw-vf-arrow">↓</div>
            <div className="hiw-vf-item">Another student finds the item</div>
            <div className="hiw-vf-arrow">↓</div>
            <div className="hiw-vf-item">Reports Found Item</div>
            <div className="hiw-vf-arrow">↓</div>
            <div className="hiw-vf-item">System checks for potential matches</div>
            <div className="hiw-vf-arrow">↓</div>
            <div className="hiw-vf-item">Potential match appears</div>
            <div className="hiw-vf-arrow">↓</div>
            <div className="hiw-vf-item">Owner submits a claim</div>
            <div className="hiw-vf-arrow">↓</div>
            <div className="hiw-vf-item">Claim is reviewed / processed</div>
            <div className="hiw-vf-arrow">↓</div>
            <div className="hiw-vf-item">Item is returned</div>
            <div className="hiw-vf-arrow">↓</div>
            <div className="hiw-vf-item">Status is updated</div>
          </div>
        </section>

        {/* SECTION 2 — ITEM CATEGORIES */}
        <section className="hiw-section">
          <span className="hiw-eyebrow">Reference</span>
          <h2 className="hiw-section-title">Item Categories</h2>
          <p className="hiw-section-subtitle">
            Select the appropriate category when reporting a Lost or Found item. These are the
            only categories currently supported by the system.
          </p>

          <div className="hiw-id-grid">
            {CATEGORIES.map((c) => (
              <div key={c.id} className="hiw-id-chip">
                <span className="hiw-id-badge">{c.id}</span>
                <span>{c.name}</span>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 3 — LOCATION CATEGORIES */}
        <section className="hiw-section">
          <span className="hiw-eyebrow">Reference</span>
          <h2 className="hiw-section-title">College Locations</h2>
          <p className="hiw-section-subtitle">
            Select the location where the item was lost or found. The system intentionally uses
            these main college locations only, without floors or sub-locations, to avoid confusion.
          </p>

          <div className="hiw-id-grid">
            {LOCATIONS.map((l) => (
              <div key={l.id} className="hiw-id-chip">
                <span className="hiw-id-badge">{l.id}</span>
                <span>{l.name}</span>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 4 & 5 — REPORT LOST / FOUND */}
        <section className="hiw-section">
          <span className="hiw-eyebrow">Reporting</span>
          <h2 className="hiw-section-title">Reporting a Lost or Found Item</h2>
          <p className="hiw-section-subtitle">
            Reporting a Lost item and reporting a Found item follow the same basic steps, but they
            live on separate pages and serve different purposes.
          </p>

          <div className="hiw-two-col">
            {/* Lost column */}
            <div>
              <div className="hiw-col-header">
                <span className="badge badge-lost">🟠 Lost</span>
                <h3>How to Report a Lost Item</h3>
              </div>
              <div className="hiw-steps">
                <div className="hiw-step">
                  <div className="hiw-step-number" style={{ background: 'var(--color-lost)' }}>1</div>
                  <div>
                    <h4>Login / Register</h4>
                    <p>Sign in to your account, or create one if you don't have it yet.</p>
                  </div>
                </div>
                <div className="hiw-step">
                  <div className="hiw-step-number" style={{ background: 'var(--color-lost)' }}>2</div>
                  <div>
                    <h4>Go to "Lost Items"</h4>
                    <p>Open the Lost Items page and click "Report Lost Item".</p>
                  </div>
                </div>
                <div className="hiw-step">
                  <div className="hiw-step-number" style={{ background: 'var(--color-lost)' }}>3</div>
                  <div>
                    <h4>Enter the item information</h4>
                    <ul>
                      <li>Item name / title</li>
                      <li>Category</li>
                      <li>Location</li>
                      <li>Date</li>
                      <li>Description</li>
                      <li>Image, if the form supports it</li>
                    </ul>
                  </div>
                </div>
                <div className="hiw-step">
                  <div className="hiw-step-number" style={{ background: 'var(--color-lost)' }}>4</div>
                  <div>
                    <h4>Submit the report</h4>
                    <p>Your Lost Item report is saved and becomes visible in the system.</p>
                  </div>
                </div>
                <div className="hiw-step">
                  <div className="hiw-step-number" style={{ background: 'var(--color-lost)' }}>5</div>
                  <div>
                    <h4>Wait for matching</h4>
                    <p>
                      Your report is now available for matching. Check the Matches page and your
                      notifications for potential matches, and review them carefully before
                      claiming.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Found column */}
            <div>
              <div className="hiw-col-header">
                <span className="badge badge-found">🟢 Found</span>
                <h3>How to Report a Found Item</h3>
              </div>
              <div className="hiw-steps">
                <div className="hiw-step">
                  <div className="hiw-step-number" style={{ background: 'var(--color-found)' }}>1</div>
                  <div>
                    <h4>Login / Register</h4>
                    <p>Sign in to your account, or create one if you don't have it yet.</p>
                  </div>
                </div>
                <div className="hiw-step">
                  <div className="hiw-step-number" style={{ background: 'var(--color-found)' }}>2</div>
                  <div>
                    <h4>Go to "Found Items"</h4>
                    <p>Open the Found Items page and click "Report Found Item".</p>
                  </div>
                </div>
                <div className="hiw-step">
                  <div className="hiw-step-number" style={{ background: 'var(--color-found)' }}>3</div>
                  <div>
                    <h4>Enter the item information</h4>
                    <ul>
                      <li>Item name / title</li>
                      <li>Category</li>
                      <li>Location</li>
                      <li>Date</li>
                      <li>Description</li>
                      <li>Image, if the form supports it</li>
                    </ul>
                  </div>
                </div>
                <div className="hiw-step">
                  <div className="hiw-step-number" style={{ background: 'var(--color-found)' }}>4</div>
                  <div>
                    <h4>Submit the report</h4>
                    <p>Your Found Item report is saved and becomes visible in the system.</p>
                  </div>
                </div>
                <div className="hiw-step">
                  <div className="hiw-step-number" style={{ background: 'var(--color-found)' }}>5</div>
                  <div>
                    <h4>Let the system compare it</h4>
                    <p>
                      The system can compare your Found Item against existing Lost Item reports.
                      Please don't assume ownership on your own — let the owner go through the
                      proper claim and review process.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 6 — HOW MATCHING WORKS */}
        <section className="hiw-section">
          <span className="hiw-eyebrow">Matching</span>
          <h2 className="hiw-section-title">How Matching Works</h2>
          <p className="hiw-section-subtitle">
            The system compares Lost and Found item reports and identifies potential matches
            using the information available on each report, such as category, item
            name/information, location, date, and other existing item attributes supported by
            the current system.
          </p>

          <div className="hiw-match-diagram">
            <div className="hiw-match-inputs">
              <span className="hiw-match-box" style={{ background: 'var(--color-lost)' }}>Lost Item</span>
              <span style={{ fontWeight: 700, color: 'var(--color-text-tertiary)' }}>+</span>
              <span className="hiw-match-box" style={{ background: 'var(--color-found)' }}>Found Item</span>
            </div>
            <div className="hiw-vf-arrow">↓</div>
            <div className="hiw-match-box" style={{ background: 'var(--color-accent)' }}>Matching System</div>
            <div className="hiw-vf-arrow">↓</div>
            <div className="hiw-match-box" style={{ background: 'var(--color-primary-700)' }}>Potential Match</div>
            <div className="hiw-vf-arrow">↓</div>
            <div className="hiw-vf-item" style={{ maxWidth: 260 }}>User can review the match</div>
          </div>
        </section>

        {/* SECTION 7 — MATCHES PAGE */}
        <section className="hiw-section">
          <span className="hiw-eyebrow">Matches</span>
          <h2 className="hiw-section-title">The Matches Page</h2>
          <p className="hiw-section-subtitle">
            The Matches page shows potential Lost ↔ Found relationships identified by the system.
            When you see a potential match, here's what to do:
          </p>

          <div className="hiw-checklist">
            <div className="hiw-checklist-item">
              <span>1️⃣</span>
              <span>Open and review the match.</span>
            </div>
            <div className="hiw-checklist-item">
              <span>2️⃣</span>
              <span>Compare the item details carefully.</span>
            </div>
            <div className="hiw-checklist-item">
              <span>3️⃣</span>
              <span>If it appears to be your item, proceed with the claim process.</span>
            </div>
            <div className="hiw-checklist-item">
              <span>⚠️</span>
              <span>Don't assume ownership just because the category or name is similar.</span>
            </div>
          </div>
        </section>

        {/* SECTION 8 — CLAIM PROCESS */}
        <section className="hiw-section">
          <span className="hiw-eyebrow">Claims</span>
          <h2 className="hiw-section-title">The Claim Process</h2>
          <p className="hiw-section-subtitle">
            The claim process helps prevent someone from falsely claiming another student's
            property, by adding a review step between a potential match and the actual return of
            an item.
          </p>

          <div className="hiw-process-row">
            <div className="hiw-process-card">
              <div className="hiw-process-icon">🔗</div>
              <h4>Potential Match</h4>
              <p>Found by the system</p>
            </div>
            <span className="hiw-process-arrow">→</span>
            <div className="hiw-process-card">
              <div className="hiw-process-icon">📝</div>
              <h4>Submit Claim</h4>
              <p>You confirm it's yours</p>
            </div>
            <span className="hiw-process-arrow">→</span>
            <div className="hiw-process-card">
              <div className="hiw-process-icon">🔎</div>
              <h4>Claim Review</h4>
              <p>Claim is processed</p>
            </div>
            <span className="hiw-process-arrow">→</span>
            <div className="hiw-process-card">
              <div className="hiw-process-icon">✅</div>
              <h4>Approved / Rejected</h4>
              <p>A decision is made</p>
            </div>
            <span className="hiw-process-arrow">→</span>
            <div className="hiw-process-card">
              <div className="hiw-process-icon">📦</div>
              <h4>Return</h4>
              <p>Item goes back to owner</p>
            </div>
          </div>

          <div className="hiw-vertical-flow" style={{ marginTop: 'var(--space-6)' }}>
            <div className="hiw-vf-item">Potential Match</div>
            <div className="hiw-vf-arrow">↓</div>
            <div className="hiw-vf-item">User reviews details</div>
            <div className="hiw-vf-arrow">↓</div>
            <div className="hiw-vf-item">User submits Claim</div>
            <div className="hiw-vf-arrow">↓</div>
            <div className="hiw-vf-item">Claim is processed / reviewed</div>
            <div className="hiw-vf-arrow">↓</div>
            <div className="hiw-vf-item">Claim decision</div>
            <div className="hiw-vf-arrow">↓</div>
            <div className="hiw-vf-item">If approved → recovery / return process</div>
            <div className="hiw-vf-arrow">↓</div>
            <div className="hiw-vf-item">Item status is updated</div>
          </div>
        </section>

        {/* SECTION 9 — NOTIFICATIONS */}
        <section className="hiw-section">
          <span className="hiw-eyebrow">Notifications</span>
          <h2 className="hiw-section-title">Staying Informed</h2>
          <p className="hiw-section-subtitle">
            Notifications help you stay informed about relevant events, such as potential matches
            and claim-related updates, along with any other events the system supports. Check
            the notification bell in the navigation bar, or visit the Notifications page, to see
            what's new.
          </p>
        </section>

        {/* SECTION 10 — COMPLETE EXAMPLE */}
        <section className="hiw-section">
          <span className="hiw-eyebrow">Example</span>
          <h2 className="hiw-section-title">A Complete Example</h2>
          <p className="hiw-section-subtitle">
            Here's what the whole process looks like from start to finish.
          </p>

          <div className="hiw-example-card">
            <p style={{ marginBottom: 'var(--space-4)' }}>
              A student loses a black wallet in the College Library.
            </p>

            <div className="hiw-example-grid">
              <div className="hiw-example-item lost">
                <span className="badge badge-lost" style={{ marginBottom: 'var(--space-2)' }}>🟠 Lost Report</span>
                <p style={{ margin: 0 }}>
                  They log in, go to Lost Items, and report it:
                </p>
                <ul style={{ margin: 'var(--space-2) 0 0 var(--space-4)' }}>
                  <li>Category → Wallet (ID 2)</li>
                  <li>Location → College Library (ID 9)</li>
                  <li>Description, date, and image, if available</li>
                </ul>
              </div>

              <div className="hiw-example-item found">
                <span className="badge badge-found" style={{ marginBottom: 'var(--space-2)' }}>🟢 Found Report</span>
                <p style={{ margin: 0 }}>
                  Later, another student finds a wallet and reports it:
                </p>
                <ul style={{ margin: 'var(--space-2) 0 0 var(--space-4)' }}>
                  <li>Category → Wallet (ID 2)</li>
                  <li>Location → College Library (ID 9)</li>
                </ul>
              </div>
            </div>

            <p style={{ margin: 0 }}>
              The system identifies a potential match between the two reports. The owner reviews
              the match and submits a claim. The claim is processed, and if it's accepted, the
              item can be returned — with the relevant status and notifications updated along the
              way.
            </p>
          </div>
        </section>

        {/* SECTION 11 — BEST PRACTICES */}
        <section className="hiw-section">
          <span className="hiw-eyebrow">Guidelines</span>
          <h2 className="hiw-section-title">Best Practices</h2>

          <div className="hiw-checklist">
            <div className="hiw-checklist-item">
              <span>✅</span>
              <span>Provide accurate item descriptions.</span>
            </div>
            <div className="hiw-checklist-item">
              <span>✅</span>
              <span>Select the correct category.</span>
            </div>
            <div className="hiw-checklist-item">
              <span>✅</span>
              <span>Select the correct college location.</span>
            </div>
            <div className="hiw-checklist-item">
              <span>✅</span>
              <span>Add a useful image when the form supports it.</span>
            </div>
            <div className="hiw-checklist-item">
              <span>🚫</span>
              <span>Do not falsely claim an item.</span>
            </div>
            <div className="hiw-checklist-item">
              <span>🔎</span>
              <span>Review match details carefully.</span>
            </div>
            <div className="hiw-checklist-item">
              <span>🔔</span>
              <span>Keep notifications enabled and check them regularly.</span>
            </div>
            <div className="hiw-checklist-item">
              <span>🤝</span>
              <span>Report found items so owners have a chance to recover them.</span>
            </div>
          </div>
        </section>

        {/* SECTION 12 — VISUAL FLOW */}
        <section className="hiw-section">
          <span className="hiw-eyebrow">Summary</span>
          <h2 className="hiw-section-title">The Full Flow, At a Glance</h2>

          <div className="hiw-vertical-flow">
            <div className="hiw-vf-item" style={{ background: 'var(--color-lost-bg)', color: 'var(--color-lost)' }}>LOST</div>
            <div className="hiw-vf-arrow">↓</div>
            <div className="hiw-vf-item" style={{ background: 'var(--color-lost-bg)', color: 'var(--color-lost)' }}>REPORT LOST</div>
            <div className="hiw-vf-arrow">↓</div>
            <div className="hiw-vf-item" style={{ background: 'var(--color-accent-bg)', color: 'var(--color-accent)' }}>MATCHING</div>
            <div className="hiw-vf-arrow">↕</div>
            <div className="hiw-vf-item" style={{ background: 'var(--color-found-bg)', color: 'var(--color-found)' }}>FOUND</div>
            <div className="hiw-vf-arrow">↓</div>
            <div className="hiw-vf-item" style={{ background: 'var(--color-primary-100)', color: 'var(--color-primary-800)' }}>POTENTIAL MATCH</div>
            <div className="hiw-vf-arrow">↓</div>
            <div className="hiw-vf-item" style={{ background: 'var(--color-primary-100)', color: 'var(--color-primary-800)' }}>CLAIM</div>
            <div className="hiw-vf-arrow">↓</div>
            <div className="hiw-vf-item" style={{ background: 'var(--color-primary-100)', color: 'var(--color-primary-800)' }}>REVIEW</div>
            <div className="hiw-vf-arrow">↓</div>
            <div className="hiw-vf-item" style={{ background: 'var(--color-found-bg)', color: 'var(--color-found)' }}>RETURN</div>
            <div className="hiw-vf-arrow">↓</div>
            <div className="hiw-vf-item" style={{ background: 'var(--color-found-bg)', color: 'var(--color-found)' }}>RECOVERED</div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="hiw-section">
          <div className="hiw-home-cta">
            <div className="hiw-home-cta-text">
              <h3>Ready to get started?</h3>
              <p>Report a lost or found item now, or check the Matches page.</p>
            </div>
            <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
              <Link to="/lost-items?new=1" className="btn btn-lost">
                📋 Report Lost Item
              </Link>
              <Link to="/found-items?new=1" className="btn btn-found">
                📦 Report Found Item
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
