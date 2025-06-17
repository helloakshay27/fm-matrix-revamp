import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { LayoutProvider } from './contexts/LayoutContext';
import { Layout } from './components/Layout';
import { SetupLayout } from './components/SetupLayout';

// Import existing pages
import { Index } from './pages/Index';
import { Dashboard } from './pages/Dashboard';
import { Settings } from './pages/Settings';
import { Profile } from './pages/Profile';
import { NotFound } from './pages/NotFound';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ForgotPassword } from './pages/ForgotPassword';
import { ResetPassword } from './pages/ResetPassword';
import { VerifyEmail } from './pages/VerifyEmail';
import { Unauthorized } from './pages/Unauthorized';
import { ServerError } from './pages/ServerError';
import { Maintenance } from './pages/Maintenance';
import { ComingSoon } from './pages/ComingSoon';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { TermsOfService } from './pages/TermsOfService';
import { Help } from './pages/Help';
import { Contact } from './pages/Contact';
import { About } from './pages/About';
import { Pricing } from './pages/Pricing';
import { Features } from './pages/Features';
import { Testimonials } from './pages/Testimonials';
import { Team } from './pages/Team';
import { Careers } from './pages/Careers';
import { Blog } from './pages/Blog';
import { BlogPost } from './pages/BlogPost';
import { Documentation } from './pages/Documentation';
import { Changelog } from './pages/Changelog';
import { Roadmap } from './pages/Roadmap';
import { Status } from './pages/Status';
import { Integrations } from './pages/Integrations';
import { Partners } from './pages/Partners';
import { Affiliates } from './pages/Affiliates';
import { Developers } from './pages/Developers';
import { API } from './pages/API';
import { SDKs } from './pages/SDKs';
import { Libraries } from './pages/Libraries';
import { Tools } from './pages/Tools';
import { Resources } from './pages/Resources';
import { Community } from './pages/Community';
import { Events } from './pages/Events';
import { Webinars } from './pages/Webinars';
import { Workshops } from './pages/Workshops';
import { Conferences } from './pages/Conferences';
import { Meetups } from './pages/Meetups';
import { Forums } from './pages/Forums';
import { Discord } from './pages/Discord';
import { Slack } from './pages/Slack';
import { Twitter } from './pages/Twitter';
import { Facebook } from './pages/Facebook';
import { Instagram } from './pages/Instagram';
import { LinkedIn } from './pages/LinkedIn';
import { YouTube } from './pages/YouTube';
import { GitHub } from './pages/GitHub';
import { GitLab } from './pages/GitLab';
import { BitBucket } from './pages/BitBucket';
import { CodeSandbox } from './pages/CodeSandbox';
import { StackBlitz } from './pages/StackBlitz';
import { CodePen } from './pages/CodePen';
import { JSFiddle } from './pages/JSFiddle';
import { Replit } from './pages/Replit';
import { Glitch } from './pages/Glitch';
import { Netlify } from './pages/Netlify';
import { Vercel } from './pages/Vercel';
import { Heroku } from './pages/Heroku';
import { AWS } from './pages/AWS';
import { GCP } from './pages/GCP';
import { Azure } from './pages/Azure';
import { DigitalOcean } from './pages/DigitalOcean';
import { Linode } from './pages/Linode';
import { Vultr } from './pages/Vultr';
import { Cloudflare } from './pages/Cloudflare';
import { Fastly } from './pages/Fastly';
import { Akamai } from './pages/Akamai';
import { CloudFront } from './pages/CloudFront';
import { Firebase } from './pages/Firebase';
import { Supabase } from './pages/Supabase';
import { Fauna } from './pages/Fauna';
import { MongoDB } from './pages/MongoDB';
import { PostgreSQL } from './pages/PostgreSQL';
import { MySQL } from './pages/MySQL';
import { Redis } from './pages/Redis';
import { ElasticSearch } from './pages/ElasticSearch';
import { Algolia } from './pages/Algolia';
import { Meilisearch } from './pages/Meilisearch';
import { Typesense } from './pages/Typesense';
import { Stripe } from './pages/Stripe';
import { PayPal } from './pages/PayPal';
import { Braintree } from './pages/Braintree';
import { Square } from './pages/Square';
import { Adyen } from './pages/Adyen';
import { Checkout } from './pages/Checkout';
import { Auth } from './pages/Auth';
import { OAuth } from './pages/OAuth';
import { SAML } from './pages/SAML';
import { OIDC } from './pages/OIDC';
import { LDAP } from './pages/LDAP';
import { ActiveDirectory } from './pages/ActiveDirectory';
import { Okta } from './pages/Okta';
import { Auth0 } from './pages/Auth0';
import { Cognito } from './pages/Cognito';
import { Firebase as FirebaseAuth } from './pages/FirebaseAuth';
import { Supabase as SupabaseAuth } from './pages/SupabaseAuth';
import { Clerk } from './pages/Clerk';
import { Magic } from './pages/Magic';
import { Descope } from './pages/Descope';
import { Stytch } from './pages/Stytch';
import { WorkOS } from './pages/WorkOS';
import { PropelAuth } from './pages/PropelAuth';
import { Userfront } from './pages/Userfront';
import { Lucia } from './pages/Lucia';
import { NextAuth } from './pages/NextAuth';
import { Passport } from './pages/Passport';
import { Keycloak } from './pages/Keycloak';
import { IdentityServer } from './pages/IdentityServer';
import { Ory } from './pages/Ory';
import { Logto } from './pages/Logto';
import { Zitadel } from './pages/Zitadel';
import { Cerbos } from './pages/Cerbos';
import { Permit } from './pages/Permit';
import { OpenFGA } from './pages/OpenFGA';
import { Casbin } from './pages/Casbin';
import { OPA } from './pages/OPA';
import { RBAC } from './pages/RBAC';
import { ABAC } from './pages/ABAC';
import { PBAC } from './pages/PBAC';
import { ReBAC } from './pages/ReBAC';
import { GBAC } from './pages/GBAC';
import { CBAC } from './pages/CBAC';
import { TBAC } from './pages/TBAC';
import { UBAC } from './pages/UBAC';
import { ZBAC } from './pages/ZBAC';
import { XBAC } from './pages/XBAC';
import { YBAC } from './pages/YBAC';
import { WBAC } from './pages/WBAC';
import { VBAC } from './pages/VBAC';
import { UBAC as UBAC2 } from './pages/UBAC2';
import { TBAC as TBAC2 } from './pages/TBAC2';
import { SBAC } from './pages/SBAC';
import { RBAC as RBAC2 } from './pages/RBAC2';
import { QBAC } from './pages/QBAC';
import { PBAC as PBAC2 } from './pages/PBAC2';
import { OBAC } from './pages/OBAC';
import { NBAC } from './pages/NBAC';
import { MBAC } from './pages/MBAC';
import { LBAC } from './pages/LBAC';
import { KBAC } from './pages/KBAC';
import { JBAC } from './pages/JBAC';
import { IBAC } from './pages/IBAC';
import { HBAC } from './pages/HBAC';
import { GBAC as GBAC2 } from './pages/GBAC2';
import { FBAC } from './pages/FBAC';
import { EBAC } from './pages/EBAC';
import { DBAC } from './pages/DBAC';
import { CBAC as CBAC2 } from './pages/CBAC2';
import { BBAC } from './pages/BBAC';
import { ABAC as ABAC2 } from './pages/ABAC2';

// Import new Fitout pages
import { FitoutSetupDashboard } from './pages/FitoutSetupDashboard';
import { FitoutRequestListDashboard } from './pages/FitoutRequestListDashboard';
import { FitoutChecklistDashboard } from './pages/FitoutChecklistDashboard';
import { FitoutViolationDashboard } from './pages/FitoutViolationDashboard';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LayoutProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Index />} />
              
              {/* Fitout Routes */}
              <Route path="/transitioning/fitout/setup" element={<FitoutSetupDashboard />} />
              <Route path="/transitioning/fitout/request" element={<FitoutRequestListDashboard />} />
              <Route path="/transitioning/fitout/checklist" element={<FitoutChecklistDashboard />} />
              <Route path="/transitioning/fitout/violation" element={<FitoutViolationDashboard />} />
              
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/verify-email" element={<VerifyEmail />} />
              <Route path="/unauthorized" element={<Unauthorized />} />
              <Route path="/server-error" element={<ServerError />} />
              <Route path="/maintenance" element={<Maintenance />} />
              <Route path="/coming-soon" element={<ComingSoon />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
              <Route path="/help" element={<Help />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/about" element={<About />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/features" element={<Features />} />
              <Route path="/testimonials" element={<Testimonials />} />
              <Route path="/team" element={<Team />} />
              <Route path="/careers" element={<Careers />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:id" element={<BlogPost />} />
              <Route path="/documentation" element={<Documentation />} />
              <Route path="/changelog" element={<Changelog />} />
              <Route path="/roadmap" element={<Roadmap />} />
              <Route path="/status" element={<Status />} />
              <Route path="/integrations" element={<Integrations />} />
              <Route path="/partners" element={<Partners />} />
              <Route path="/affiliates" element={<Affiliates />} />
              <Route path="/developers" element={<Developers />} />
              <Route path="/api" element={<API />} />
              <Route path="/sdks" element={<SDKs />} />
              <Route path="/libraries" element={<Libraries />} />
              <Route path="/tools" element={<Tools />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/community" element={<Community />} />
              <Route path="/events" element={<Events />} />
              <Route path="/webinars" element={<Webinars />} />
              <Route path="/workshops" element={<Workshops />} />
              <Route path="/conferences" element={<Conferences />} />
              <Route path="/meetups" element={<Meetups />} />
              <Route path="/forums" element={<Forums />} />
              <Route path="/discord" element={<Discord />} />
              <Route path="/slack" element={<Slack />} />
              <Route path="/twitter" element={<Twitter />} />
              <Route path="/facebook" element={<Facebook />} />
              <Route path="/instagram" element={<Instagram />} />
              <Route path="/linkedin" element={<LinkedIn />} />
              <Route path="/youtube" element={<YouTube />} />
              <Route path="/github" element={<GitHub />} />
              <Route path="/gitlab" element={<GitLab />} />
              <Route path="/bitbucket" element={<BitBucket />} />
              <Route path="/codesandbox" element={<CodeSandbox />} />
              <Route path="/stackblitz" element={<StackBlitz />} />
              <Route path="/codepen" element={<CodePen />} />
              <Route path="/jsfiddle" element={<JSFiddle />} />
              <Route path="/replit" element={<Replit />} />
              <Route path="/glitch" element={<Glitch />} />
              <Route path="/netlify" element={<Netlify />} />
              <Route path="/vercel" element={<Vercel />} />
              <Route path="/heroku" element={<Heroku />} />
              <Route path="/aws" element={<AWS />} />
              <Route path="/gcp" element={<GCP />} />
              <Route path="/azure" element={<Azure />} />
              <Route path="/digitalocean" element={<DigitalOcean />} />
              <Route path="/linode" element={<Linode />} />
              <Route path="/vultr" element={<Vultr />} />
              <Route path="/cloudflare" element={<Cloudflare />} />
              <Route path="/fastly" element={<Fastly />} />
              <Route path="/akamai" element={<Akamai />} />
              <Route path="/cloudfront" element={<CloudFront />} />
              <Route path="/firebase" element={<Firebase />} />
              <Route path="/supabase" element={<Supabase />} />
              <Route path="/fauna" element={<Fauna />} />
              <Route path="/mongodb" element={<MongoDB />} />
              <Route path="/postgresql" element={<PostgreSQL />} />
              <Route path="/mysql" element={<MySQL />} />
              <Route path="/redis" element={<Redis />} />
              <Route path="/elasticsearch" element={<ElasticSearch />} />
              <Route path="/algolia" element={<Algolia />} />
              <Route path="/meilisearch" element={<Meilisearch />} />
              <Route path="/typesense" element={<Typesense />} />
              <Route path="/stripe" element={<Stripe />} />
              <Route path="/paypal" element={<PayPal />} />
              <Route path="/braintree" element={<Braintree />} />
              <Route path="/square" element={<Square />} />
              <Route path="/adyen" element={<Adyen />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/oauth" element={<OAuth />} />
              <Route path="/saml" element={<SAML />} />
              <Route path="/oidc" element={<OIDC />} />
              <Route path="/ldap" element={<LDAP />} />
              <Route path="/active-directory" element={<ActiveDirectory />} />
              <Route path="/okta" element={<Okta />} />
              <Route path="/auth0" element={<Auth0 />} />
              <Route path="/cognito" element={<Cognito />} />
              <Route path="/firebase-auth" element={<FirebaseAuth />} />
              <Route path="/supabase-auth" element={<SupabaseAuth />} />
              <Route path="/clerk" element={<Clerk />} />
              <Route path="/magic" element={<Magic />} />
              <Route path="/descope" element={<Descope />} />
              <Route path="/stytch" element={<Stytch />} />
              <Route path="/workos" element={<WorkOS />} />
              <Route path="/propelauth" element={<PropelAuth />} />
              <Route path="/userfront" element={<Userfront />} />
              <Route path="/lucia" element={<Lucia />} />
              <Route path="/nextauth" element={<NextAuth />} />
              <Route path="/passport" element={<Passport />} />
              <Route path="/keycloak" element={<Keycloak />} />
              <Route path="/identity-server" element={<IdentityServer />} />
              <Route path="/ory" element={<Ory />} />
              <Route path="/logto" element={<Logto />} />
              <Route path="/zitadel" element={<Zitadel />} />
              <Route path="/cerbos" element={<Cerbos />} />
              <Route path="/permit" element={<Permit />} />
              <Route path="/openfga" element={<OpenFGA />} />
              <Route path="/casbin" element={<Casbin />} />
              <Route path="/opa" element={<OPA />} />
              <Route path="/rbac" element={<RBAC />} />
              <Route path="/abac" element={<ABAC />} />
              <Route path="/pbac" element={<PBAC />} />
              <Route path="/rebac" element={<ReBAC />} />
              <Route path="/gbac" element={<GBAC />} />
              <Route path="/cbac" element={<CBAC />} />
              <Route path="/tbac" element={<TBAC />} />
              <Route path="/ubac" element={<UBAC />} />
              <Route path="/zbac" element={<ZBAC />} />
              <Route path="/xbac" element={<XBAC />} />
              <Route path="/ybac" element={<YBAC />} />
              <Route path="/wbac" element={<WBAC />} />
              <Route path="/vbac" element={<VBAC />} />
              <Route path="/ubac2" element={<UBAC2 />} />
              <Route path="/tbac2" element={<TBAC2 />} />
              <Route path="/sbac" element={<SBAC />} />
              <Route path="/rbac2" element={<RBAC2 />} />
              <Route path="/qbac" element={<QBAC />} />
              <Route path="/pbac2" element={<PBAC2 />} />
              <Route path="/obac" element={<OBAC />} />
              <Route path="/nbac" element={<NBAC />} />
              <Route path="/mbac" element={<MBAC />} />
              <Route path="/lbac" element={<LBAC />} />
              <Route path="/kbac" element={<KBAC />} />
              <Route path="/jbac" element={<JBAC />} />
              <Route path="/ibac" element={<IBAC />} />
              <Route path="/hbac" element={<HBAC />} />
              <Route path="/gbac2" element={<GBAC2 />} />
              <Route path="/fbac" element={<FBAC />} />
              <Route path="/ebac" element={<EBAC />} />
              <Route path="/dbac" element={<DBAC />} />
              <Route path="/cbac2" element={<CBAC2 />} />
              <Route path="/bbac" element={<BBAC />} />
              <Route path="/abac2" element={<ABAC2 />} />
              <Route path="*" element={<NotFound />} />
            </Route>
            
            {/* Setup Routes */}
            <Route path="/setup" element={<SetupLayout />}>
              <Route path="/setup/location/account" element={<div>Location Account</div>} />
              <Route path="/setup/location/building" element={<div>Location Building</div>} />
              <Route path="/setup/location/wing" element={<div>Location Wing</div>} />
              <Route path="/setup/location/area" element={<div>Location Area</div>} />
              <Route path="/setup/location/floor" element={<div>Location Floor</div>} />
              <Route path="/setup/location/unit" element={<div>Location Unit</div>} />
              <Route path="/setup/location/room" element={<div>Location Room</div>} />
              <Route path="/setup/user-role/department" element={<div>User Role Department</div>} />
              <Route path="/setup/user-role/role" element={<div>User Role Role</div>} />
              <Route path="/setup/fm-user" element={<div>FM User</div>} />
              <Route path="/setup/occupant-users" element={<div>Occupant Users</div>} />
              <Route path="/setup/meter-type" element={<div>Meter Type</div>} />
              <Route path="/setup/asset-groups" element={<div>Asset Groups</div>} />
              <Route path="/setup/checklist-group" element={<div>Checklist Group</div>} />
              <Route path="/setup/ticket/setup" element={<div>Ticket Setup</div>} />
              <Route path="/setup/ticket/escalation" element={<div>Ticket Escalation</div>} />
              <Route path="/setup/ticket/cost-approval" element={<div>Ticket Cost Approval</div>} />
              <Route path="/setup/task-escalation" element={<div>Task Escalation</div>} />
              <Route path="/setup/approval-matrix" element={<div>Approval Matrix</div>} />
              <Route path="/setup/patrolling-approval" element={<div>Patrolling Approval</div>} />
              <Route path="/setup/email-rule" element={<div>Email Rule</div>} />
              <Route path="/setup/fm-group" element={<div>FM Group</div>} />
              <Route path="/setup/master-checklist" element={<div>Master Checklist</div>} />
              <Route path="/setup/sac-hsn-setup" element={<div>SAC/HSN Setup</div>} />
              <Route path="/setup/address" element={<div>Address</div>} />
              <Route path="/setup/tag" element={<div>Tag</div>} />
              <Route path="/setup/export" element={<div>Export</div>} />
            </Route>
          </Routes>
          <Toaster />
        </Router>
      </LayoutProvider>
    </QueryClientProvider>
  );
}

export default App;
