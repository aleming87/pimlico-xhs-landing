export const metadata = {
  title: 'Terms and Conditions - Pimlico Solutions',
  description: 'Terms and Conditions for Pimlico Solutions Ltd. Read our terms of service for using the XHS Copilot platform.',
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
}

export default function TermsAndConditions() {
  return (
    <div className="bg-white px-6 py-32 lg:px-8">
      <div className="mx-auto max-w-4xl text-base leading-7 text-gray-700">
        <div className="mb-8">
          <a href="/" className="text-sm text-blue-600 hover:text-blue-500">
            ← Back to home
          </a>
        </div>
        
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Terms and Conditions
        </h1>
        
        <p className="mt-6 text-lg font-semibold text-gray-900">
          Effective date: December 1, 2025
        </p>

        <div className="mt-10 space-y-8 text-gray-700">
          <p>
            These terms and conditions (the <strong>"Terms"</strong>) govern access to and use of the Pimlico XHS™ software-as-a-service platform, any related websites, APIs and interfaces, and any content, reports and deliverables made available through them (together, the <strong>"XHS™ Copilot"</strong>).
          </p>

          <p>
            The XHS™ Copilot is provided by <strong>Pimlico Solutions Ltd.</strong>, a company registered in England and Wales under company number <strong>16505294</strong>, with its registered office at <strong>71–75 Shelton Street, Covent Garden, London, United Kingdom, WC2H 9JQ</strong> (<strong>"Pimlico"</strong>, <strong>"we"</strong>, <strong>"us"</strong>, <strong>"our"</strong>).
          </p>

          <p>
            These Terms are intended for business users only. By (i) signing an order form, statement of work or similar document that references these Terms (an <strong>"Order Form"</strong>), (ii) clicking "accept", "sign up" or a similar button, or (iii) accessing or using the XHS™ Copilot, you confirm that you are acting in the course of your trade, business or profession and agree to be bound by these Terms. If you are entering into these Terms on behalf of a company or other legal entity, you represent that you have authority to bind that entity; in that case, <strong>"Customer"</strong>, <strong>"you"</strong> and <strong>"your"</strong> refer to that entity.
          </p>

          <p>
            Any terms or conditions you send to us (including on a purchase order, in a vendor portal or via email) are expressly rejected and shall have no effect unless expressly agreed in writing and signed by Pimlico.
          </p>

          <hr className="my-12 border-gray-200" />

          {/* Section 1 */}
          <section>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-6">1. Definitions</h2>
            <p className="mb-4">In these Terms:</p>
            <ul className="space-y-3 ml-6">
              <li><strong>"Affiliate"</strong> means any entity that directly or indirectly controls, is controlled by, or is under common control with a party, where "control" means ownership of more than 50% of the voting interests.</li>
              <li><strong>"AI Credits"</strong> means the metered units used by Pimlico to measure usage of AI-powered functionality within the XHS™ Copilot (including, for example, automated monitoring, summarisation, classification, tagging, enrichment and delivery workflows, and associated API or integration calls).</li>
              <li><strong>"AI Credit Allowance"</strong> means the number of AI Credits included in the Fees for a given period, as specified in the applicable Order Form or Online Order.</li>
              <li><strong>"Authorised User"</strong> means an individual who is authorised by Customer to use the XHS™ Copilot under Customer's account, and to whom unique login credentials are supplied by Pimlico.</li>
              <li><strong>"Beta Customer"</strong> means a Customer that is expressly identified as participating in a beta, pilot or early-access programme for the XHS™ Copilot in an Order Form or similar document.</li>
              <li><strong>"Beta Period"</strong> means, for a Beta Customer, the period of up to six (6) months from the Service start date (or such other period expressly stated in the Order Form) during which AI Credit Usage Fees and AI Credit overage charges are waived in accordance with clause 8.4.</li>
              <li><strong>"Contract"</strong> means the legally binding agreement between Pimlico and Customer formed in accordance with clause 4.</li>
              <li><strong>"Customer Data"</strong> means any data, content, documents, configuration, prompts, queries or other information submitted to, stored within or generated within the XHS™ Copilot by or on behalf of Customer or its Authorised Users (including personal data relating to Customer's employees, clients or other contacts).</li>
              <li><strong>"Documentation"</strong> means any user guides, technical documentation, onboarding materials and usage policies for the XHS™ Copilot made available by Pimlico, as updated from time to time.</li>
              <li><strong>"General Release"</strong> means the date on which Pimlico designates a version of the XHS™ Copilot (or relevant module) as generally available for production use outside the applicable beta, pilot or early-access programme.</li>
              <li><strong>"Intellectual Property Rights"</strong> or <strong>"IPR"</strong> means patents, rights to inventions, copyright and related rights, trade marks, trade names, domain names, rights in get-up, goodwill, rights in designs, database rights, confidential information, and all similar or equivalent rights existing anywhere in the world, whether registered or unregistered.</li>
              <li><strong>"Materials"</strong> means all reports, dashboards, alerts, newsletters, data outputs, analyses, research, templates, written commentary and other content provided through the XHS™ Copilot or otherwise by Pimlico (excluding Customer Data).</li>
              <li><strong>"Online Order"</strong> means a subscription or purchase for the XHS™ Copilot placed through an online sign-up, in-app purchase flow or similar mechanism made available by Pimlico.</li>
              <li><strong>"Service Period"</strong> or <strong>"Subscription Term"</strong> means the initial term and any renewal term(s) for the XHS™ Copilot, as specified in the applicable Order Form or Online Order.</li>
              <li><strong>"Services"</strong> means the XHS™ Copilot, any related APIs, professional services (including onboarding, configuration or bespoke research) and support services supplied by Pimlico under these Terms.</li>
              <li><strong>"AI Credit Usage Fees"</strong> means the usage-based fees payable by Customer for consumption of AI Credits beyond any AI Credit Allowance, as specified in the applicable Order Form or Online Order.</li>
              <li><strong>"Website"</strong> means any website operated by or on behalf of Pimlico through which the XHS™ Copilot or related information is made available.</li>
            </ul>
          </section>

          <hr className="my-12 border-gray-200" />

          {/* Section 2 */}
          <section>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-6">2. Scope of services</h2>
            
            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">2.1 Nature of the XHS™ Copilot</h3>
            <p>
              XHS™ is a subscription-based platform providing regulatory and market intelligence, workflow tools and analytical functionality. The precise modules, features, usage limits and Authorised User numbers purchased by Customer are set out in the applicable Order Form or Online Order and any accompanying service description.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">2.2 Access methods</h3>
            <p>
              Customer may access the XHS™ Copilot via web interfaces, APIs, agents, integrations or other methods described in the Documentation.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">2.3 No legal or professional advice</h3>
            <p>
              The Materials and outputs of the XHS™ Copilot are for general information only. They do not constitute legal, financial, regulatory or other professional advice, and should not be relied on as a definitive or complete statement of law, regulation or risk. Customer remains solely responsible for obtaining appropriate professional advice and making its own decisions.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">2.4 Support and service levels</h3>
            <p>Unless expressly stated otherwise in an Order Form:</p>
            <ul className="list-disc ml-6 mt-3 space-y-2">
              <li>Pimlico will provide reasonable remote support during normal business hours for issues relating to the XHS™ Copilot; and</li>
              <li>any uptime, response-time or service credit commitments will be as expressly set out in the Order Form or a separate service level agreement (if any). Any service credits specified in such documents shall be Customer's sole and exclusive remedy for service availability or performance issues.</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">2.5 Beta programme and General Release</h3>
            <p>Where Customer is a Beta Customer:</p>
            <ul className="list-disc ml-6 mt-3 space-y-2">
              <li>during the Beta Period, Pimlico will make the relevant XHS™ Copilot functionality available on a beta, pilot or early-access basis and may change, suspend or withdraw such functionality at any time;</li>
              <li>during the Beta Period, there will be no contractual limit on the number of Authorised Users or monitored jurisdictions that may access or use the XHS™ Copilot for Customer's internal business purposes, provided Customer's use remains reasonable and in accordance with these Terms; and</li>
              <li>Customer's use of AI-powered functionality during the Beta Period will be measured in AI Credits but AI Credit Usage Fees and associated overage charges for such usage will be waived in accordance with clause 8.4.</li>
            </ul>
            <p className="mt-3">
              Pimlico will notify the Beta Customer when the relevant functionality moves to General Release. From the effective date of General Release, the charging of AI Credit Usage Fees will commence or continue in accordance with clause 8 and the applicable Order Form.
            </p>
          </section>

          <hr className="my-12 border-gray-200" />

          {/* Section 3 */}
          <section>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-6">3. Eligibility and customer information</h2>
            
            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">3.1 Business use only</h3>
            <p>
              Customer warrants that it is entering into these Terms in the course of its trade, business or profession and not as a consumer.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">3.2 Customer information</h3>
            <p>
              Customer warrants that all information it provides to Pimlico (including in any Order Form, Online Order or vendor set-up process) is true, accurate and complete, and will promptly update such information if it changes.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">3.3 Compliance</h3>
            <p>
              Customer is responsible for complying with all applicable laws, rules and regulations in connection with its use of the XHS™ Service and Materials.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">3.4 Responsibility for use</h3>
            <p>Customer is responsible for:</p>
            <ul className="list-disc ml-6 mt-3 space-y-2">
              <li>all activities occurring under its accounts, whether by Authorised Users or otherwise; and</li>
              <li>ensuring that its Authorised Users comply with these Terms and the Documentation.</li>
            </ul>
          </section>

          <hr className="my-12 border-gray-200" />

          {/* Section 4 */}
          <section>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-6">4. Orders, formation of Contract and priority</h2>
            
            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">4.1 Orders</h3>
            <p>Services may be ordered:</p>
            <ul className="list-disc ml-6 mt-3 space-y-2">
              <li>by signing an Order Form provided by Pimlico; or</li>
              <li>by completing an Online Order.</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">4.2 Offer and acceptance</h3>
            <ul className="list-disc ml-6 space-y-2">
              <li>Submission of a signed Order Form by Customer constitutes an offer to purchase the Services on these Terms (together with any terms in the Order Form that supplement, but do not conflict with, these Terms).</li>
              <li>Completion of an Online Order and payment of the relevant fees constitutes an offer to purchase the Services on these Terms and any plan-specific details presented at checkout.</li>
              <li>The Contract between Pimlico and Customer is formed when Pimlico issues written confirmation (including by email or through the XHS™ Service interface) or enables Customer's access to the XHS™ Service (whichever is earlier).</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">4.3 Priority of documents</h3>
            <p>In case of conflict or inconsistency, the following order of precedence applies:</p>
            <ol className="list-decimal ml-6 mt-3 space-y-2">
              <li>the Order Form (including any specific service descriptions or SLAs therein);</li>
              <li>any service-specific policy expressly incorporated into the Order Form;</li>
              <li>these Terms;</li>
              <li>the Documentation; and</li>
              <li>any other document.</li>
            </ol>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">4.4 Visitors</h3>
            <p>
              Where Customer or its personnel access any public portion of the Website without an Order Form or Online Order, a Contract is formed when they first access or use those sites, and these Terms apply (mutatis mutandis) to that use.
            </p>
          </section>

          <hr className="my-12 border-gray-200" />

          {/* Section 5 */}
          <section>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-6">5. Access, accounts and security</h2>
            
            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">5.1 Account creation</h3>
            <p>
              Once the Contract is formed, Pimlico will issue login credentials for the agreed number and type of Authorised Users or provide access keys for API-based use of the XHS™ Service.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">5.2 Customer responsibilities</h3>
            <p>Customer shall:</p>
            <ul className="list-disc ml-6 mt-3 space-y-2">
              <li>ensure that each username and password is used only by a single individual Authorised User;</li>
              <li>keep all credentials secure and confidential;</li>
              <li>promptly notify Pimlico if it becomes aware of any actual or suspected unauthorised use of its accounts or credentials; and</li>
              <li>maintain appropriate security, backup and virus-protection measures in relation to its own systems and devices.</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">5.3 Unauthorised access</h3>
            <p>
              Pimlico is not liable for any loss or damage arising from unauthorised access to the XHS™ Service resulting from Customer's or its Authorised Users' failure to safeguard credentials.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">5.4 Connectivity and equipment</h3>
            <p>
              Customer is solely responsible for procuring and maintaining network connections, hardware, software, browsers and other equipment necessary for accessing the Services. Pimlico is not responsible for any failure to access the Services caused by Customer's systems, connectivity or third-party providers.
            </p>
          </section>

          <hr className="my-12 border-gray-200" />

          {/* Section 6 */}
          <section>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-6">6. Licence grants and use restrictions</h2>
            
            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">6.1 Licence to use the XHS™ Service and Materials</h3>
            <p>
              Subject to timely payment of all applicable fees and compliance with the Contract, Pimlico grants to Customer, for the Subscription Term, a non-exclusive, non-transferable, non-sublicensable, limited licence to:
            </p>
            <ul className="list-disc ml-6 mt-3 space-y-2">
              <li>allow Authorised Users to access and use the XHS™ Service in accordance with the Documentation and these Terms; and</li>
              <li>access, view and use the Materials internally for Customer's own business purposes only.</li>
            </ul>
            <p className="mt-3">
              Unless expressly stated in the Order Form, Customer's licence is limited to internal business use and does not permit resale, onward provision as a service, or redistribution of Materials to third parties.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">6.2 Permitted internal use of Materials</h3>
            <p>Each Authorised User may, for Customer's internal business purposes:</p>
            <ul className="list-disc ml-6 mt-3 space-y-2">
              <li>display Materials on screen;</li>
              <li>download and store a reasonable number of extracts from Materials; and</li>
              <li>print a reasonable number of copies of such extracts,</li>
            </ul>
            <p className="mt-3">
              provided that Customer maintains all notices of Pimlico's and third parties' rights and complies with the restrictions in clause 6.3.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">6.3 Restrictions</h3>
            <p className="mb-3">
              Customer shall not (and shall ensure that Authorised Users do not), except to the extent expressly permitted by law and not capable of exclusion by agreement:
            </p>
            <ul className="list-disc ml-6 space-y-2">
              <li>copy, reproduce, modify, adapt, translate, create derivative works from, frame, mirror or otherwise exploit any part of the XHS™ Service or Materials (other than as expressly permitted under clause 6.2);</li>
              <li>sublicense, sell, rent, lease, transfer, distribute, provide as a service bureau or otherwise commercially exploit the XHS™ Service or Materials to any third party;</li>
              <li>attempt to reverse engineer, disassemble, decompile or otherwise derive source code from any software forming part of the XHS™ Service (except to the limited extent permitted by section 50B of the Copyright, Designs and Patents Act 1988 and only after giving Pimlico prior written notice);</li>
              <li>bypass or interfere with any security, access control or rate-limiting mechanisms;</li>
              <li>access or use the Services in order to build a product or service that is competitive with the XHS™ Service or that replicates any substantial part of its functionality, architecture or content;</li>
              <li>systematically download, scrape, harvest, cache or store Materials to create a database or archive of regulatory or market content (whether in electronic or physical form) other than as reasonably required for internal use;</li>
              <li>remove, obscure or alter any copyright, trade mark or other proprietary notices;</li>
              <li>carry out or commission any benchmarking, penetration testing or load testing of the XHS™ Service without Pimlico's prior written consent;</li>
              <li>use the Services in any unlawful, fraudulent or abusive manner, including in breach of applicable sanctions, export controls, data protection or financial crime laws; or</li>
              <li>use the Services in high-risk environments where failure could reasonably be expected to result in death, personal injury, or severe physical or environmental damage.</li>
            </ul>
            <p className="mt-4">
              Pimlico may suspend or restrict access to the Services (without liability) where it reasonably suspects that the Services are being used in breach of this clause 6.3 or otherwise in a way that may compromise security, integrity or availability.
            </p>
          </section>

          <hr className="my-12 border-gray-200" />

          {/* Section 7 */}
          <section>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-6">7. Customer obligations and Customer Data</h2>
            
            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">7.1 Customer obligations</h3>
            <p>Customer shall:</p>
            <ul className="list-disc ml-6 mt-3 space-y-2">
              <li>use the XHS™ Service and Materials only in accordance with these Terms, the Documentation and applicable laws;</li>
              <li>provide Pimlico with all co-operation and information reasonably required to deliver the Services;</li>
              <li>promptly correct any errors in its own systems or software that adversely impact the XHS™ Service;</li>
              <li>ensure that Customer Data does not contain viruses, malicious code or other harmful components; and</li>
              <li>ensure that it has obtained all necessary rights, licences and consents (including from data subjects) to upload, process and use Customer Data in connection with the Services.</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">7.2 Ownership of Customer Data</h3>
            <p>
              As between the parties, Customer retains all rights, title and interest (including IPR) in and to Customer Data. Pimlico acquires no rights to Customer Data except as expressly granted in these Terms.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">7.3 Licence to Customer Data</h3>
            <p>Customer grants Pimlico a non-exclusive, worldwide, royalty-free licence to host, copy, process, transmit and otherwise use Customer Data:</p>
            <ul className="list-disc ml-6 mt-3 space-y-2">
              <li>to provide, support and maintain the XHS™ Service and related Services;</li>
              <li>to prevent or address service, security or technical issues; and</li>
              <li>as otherwise documented in the Contract or instructed by Customer.</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">7.4 Aggregated and anonymised data</h3>
            <p>
              Pimlico may collect and use (during and after the Subscription Term) aggregated and anonymised data derived from Customer's use of the Services, provided that such data does not identify Customer or any individual. Pimlico may use such data to operate, analyse, improve and develop the XHS™ Service and its business, and may publish high-level statistical information that does not identify Customer.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">7.5 Responsibility for Customer Data</h3>
            <p>
              Customer is solely responsible for the accuracy, quality, legality and appropriateness of Customer Data and for how it uses the outputs of the XHS™ Service. Pimlico has no obligation to monitor Customer Data but may remove or disable access to Customer Data that it reasonably believes to be unlawful, in breach of these Terms or otherwise likely to give rise to liability.
            </p>
          </section>

          <hr className="my-12 border-gray-200" />

          {/* Section 8 */}
          <section>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-6">8. Fees, billing and payment</h2>
            
            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">8.1 Fees</h3>
            <p>Fees for the Services are set out in the Order Form, Online Order or applicable plan description and, unless stated otherwise, are:</p>
            <ul className="list-disc ml-6 mt-3 space-y-2">
              <li>exclusive of VAT and any other applicable taxes, which shall be added at the appropriate rate; and</li>
              <li>based on (i) subscription or base fees for access to the XHS™ Copilot and its modules, and (ii) usage-based AI Credit charges, together with any other metrics specified in the Order Form or plan.</li>
            </ul>
            <p className="mt-3">
              Where Customer exceeds any agreed usage parameters or AI Credit Allowance, Pimlico may charge additional fees at the overage rates set out in the Order Form or otherwise notified to Customer.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">8.2 Subscription commitment and auto-renewal</h3>
            <p>Unless the Order Form states otherwise:</p>
            <ul className="list-disc ml-6 mt-3 space-y-2">
              <li>each Subscription Term is twelve (12) months, or such other period expressly stated in the Order Form;</li>
              <li>Customer commits to the full fees for the Subscription Term, which are collected on a monthly schedule as set out in clause 8.3; and</li>
              <li>at the end of each Subscription Term, the subscription will automatically renew for a further Subscription Term of the same length (twelve months or the alternative period stated in the Order Form), unless either party gives notice in accordance with clause 9.1.</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">8.3 Payment method and timing (card, monthly)</h3>
            <p>Unless the Order Form expressly states different billing terms:</p>
            <ul className="list-disc ml-6 mt-3 space-y-2">
              <li>fees for each Subscription Term are payable in equal monthly instalments in advance, calculated by dividing the total subscription or base fees for the Subscription Term by the number of months in that term;</li>
              <li>the first monthly instalment is due and will be charged on the date the Customer signs the relevant Order Form or completes the Online Order (as applicable);</li>
              <li>subsequent monthly instalments will be charged automatically on or around the same calendar day each month during the Subscription Term (or, where the month has no such day, on the last day of that month); and</li>
              <li>by providing card details, the Customer represents that it is authorised to use the relevant card and authorises Pimlico and its third-party payment processors to charge all amounts due under the Contract on a recurring basis using that card (or any replacement card the Customer later provides).</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">8.4 AI Credit charging model</h3>
            <p>AI Credits are used to measure Customer's usage of AI-powered functionality within the XHS™ Copilot. Unless the Order Form states otherwise:</p>
            <ul className="list-disc ml-6 mt-3 space-y-2">
              <li>an AI Credit Allowance for a given period (for example, per month) will be set out in the Order Form or applicable plan description;</li>
              <li>where Customer's AI Credit consumption in that period exceeds the AI Credit Allowance, AI Credit Usage Fees will apply to the excess usage at the rates specified in the Order Form or applicable plan description;</li>
              <li>Pimlico will make reasonable usage and consumption information available to Customer via the XHS™ Copilot or other reporting mechanism so that Customer can monitor its AI Credit consumption; and</li>
              <li>AI Credit Allowances, rate cards and overage pricing may be updated by Pimlico for any renewal Subscription Term in accordance with clause 8.9.</li>
            </ul>
            <p className="mt-3">For Beta Customers, during the Beta Period:</p>
            <ul className="list-disc ml-6 mt-3 space-y-2">
              <li>AI Credit consumption will continue to be measured and reported, but AI Credit Usage Fees and overage charges for AI Credit consumption will be waived; and</li>
              <li>all other fees set out in the Order Form, including any subscription or base fees, remain payable.</li>
            </ul>
            <p className="mt-3">
              From the earlier of (a) the end of the Beta Period or (b) the applicable General Release date notified by Pimlico, AI Credit Usage Fees and overage charges will become payable in accordance with the Order Form and this clause 8.4.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">8.5 Changes during the Subscription Term</h3>
            <p>If the Customer upgrades its plan, adds modules or increases the number of Authorised Users or other billable units during a Subscription Term, Pimlico may:</p>
            <ul className="list-disc ml-6 mt-3 space-y-2">
              <li>increase the monthly instalments for the remainder of that Subscription Term to reflect the new scope; and</li>
              <li>where applicable, charge a pro-rated amount for the period from the date of the change to the next billing date.</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">8.6 Card failures and alternative payment</h3>
            <p>The Customer must ensure that its payment card details remain valid and that sufficient funds are available. If a card payment fails:</p>
            <ul className="list-disc ml-6 mt-3 space-y-2">
              <li>Pimlico may notify the Customer and request updated payment details;</li>
              <li>the Customer shall provide valid replacement details promptly; and</li>
              <li>Pimlico may, if payment has not been successfully taken within 7 days of the due date, suspend access to the Services until payment is received in cleared funds.</li>
            </ul>
            <p className="mt-3">
              Pimlico may, at its discretion, agree to accept payment by invoice and bank transfer for some or all fees, in which case the due date for such invoice(s) shall be as stated on the invoice and interest may accrue under clause 8.7.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">8.7 Late payment and interest</h3>
            <p>Without prejudice to Pimlico's other rights:</p>
            <ul className="list-disc ml-6 mt-3 space-y-2">
              <li>Pimlico may charge interest on any overdue amount that is not collected by card on the due date at the rate of 5% per annum above the Bank of England base rate, accruing daily from the due date until payment is received in full; and</li>
              <li>Pimlico may suspend access to the Services under clause 8.6 and/or clause 9.5 where undisputed amounts remain unpaid.</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">8.8 Taxes</h3>
            <p>
              The Customer is responsible for all applicable taxes arising out of the Contract, other than Pimlico's own corporation tax. If any withholding or deduction is required by law, the Customer shall increase the amount it pays such that Pimlico receives the full amount it would have received had no withholding or deduction been required.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">8.9 Price changes and renewals</h3>
            <p>
              Pimlico may adjust pricing, including subscription or base fees, AI Credit Allowances and AI Credit Usage Fees, for any renewal Subscription Term by notifying the Customer in writing at least 60 days prior to the end of the then-current Subscription Term. If the Customer does not wish to renew at the updated price, it may choose not to renew in accordance with clause 9.1.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">8.10 Non-payment and refunds</h3>
            <p>
              Pimlico reserves the right to deny or suspend access to any Services for which fees and applicable taxes have not been received in cleared funds. Except as expressly stated in these Terms or the Order Form, all fees are non-cancellable and non-refundable, irrespective of actual usage.
            </p>
          </section>

          <hr className="my-12 border-gray-200" />

          {/* Section 9 */}
          <section>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-6">9. Term, renewal and termination</h2>
            
            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">9.1 Subscription Term and non-renewal</h3>
            <p>
              The Subscription Term is as stated in the Order Form or Online Order. If no period is stated, the Subscription Term is twelve (12) months from the date the Customer signs the relevant Order Form or completes the Online Order (as applicable).
            </p>
            <p className="mt-3">
              At the end of each Subscription Term, the subscription will automatically renew for a further Subscription Term of the same length, unless either party gives the other at least 60 days' written notice of non-renewal before the end of the then-current Subscription Term.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">9.2 Termination for convenience (where allowed)</h3>
            <p>
              Where expressly stated in the Order Form or applicable plan, Customer may terminate a month-to-month or other flexible plan by giving Pimlico at least 30 days' written notice, effective at the end of the then-current billing period. Pre-paid annual or multi-year subscriptions are otherwise non-cancellable except as provided in clauses 9.4 or 10.6.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">9.3 Termination for breach or insolvency</h3>
            <p>Either party may terminate the Contract by written notice if the other party:</p>
            <ul className="list-disc ml-6 mt-3 space-y-2">
              <li>commits a material breach of the Contract and fails to remedy it within 30 days of receiving written notice describing the breach; or</li>
              <li>becomes insolvent, enters into administration or liquidation (other than for a bona fide solvent restructuring), or suffers any analogous event under the laws of its jurisdiction.</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">9.4 Termination by Customer for materially detrimental changes</h3>
            <p>
              If Pimlico makes a change to the Services or these Terms that materially and adversely affects Customer's permitted use of the Services, Customer may terminate the Contract by giving written notice before the change takes effect. If Customer terminates under this clause 9.4, Pimlico will refund a pro-rata portion of any pre-paid fees for the unused remainder of the Subscription Term. This is Customer's sole and exclusive remedy for such changes.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">9.5 Termination or suspension for misuse</h3>
            <p>Pimlico may suspend or terminate access to the Services immediately on written notice if it reasonably believes that:</p>
            <ul className="list-disc ml-6 mt-3 space-y-2">
              <li>the Services are being misused, used fraudulently or unlawfully;</li>
              <li>Customer has provided false or misleading information; or</li>
              <li>there is any other material breach of these Terms that justifies immediate suspension to protect the Services, other customers or third parties.</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">9.6 Effect of termination</h3>
            <p>On expiry or termination of the Contract for any reason:</p>
            <ul className="list-disc ml-6 mt-3 space-y-2">
              <li>all rights to access and use the Services and Materials (other than Materials already lawfully downloaded and retained for internal records) shall cease;</li>
              <li>Customer shall immediately stop all use of the Services and Materials and pay all outstanding fees and charges;</li>
              <li>Pimlico will, on request made within 30 days of termination, provide Customer with a copy of Customer Data in a commonly used, machine-readable format, to the extent reasonably practicable. After this period, Pimlico may delete or anonymise Customer Data in accordance with its retention policies, except where retention is required by law; and</li>
              <li>clauses which by their nature should continue (including clauses 7.2–7.4, 8, 9.6, 10–18) shall survive termination or expiry.</li>
            </ul>
          </section>

          <hr className="my-12 border-gray-200" />

          {/* Section 10 */}
          <section>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-6">10. Intellectual property</h2>
            
            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">10.1 Pimlico IPR</h3>
            <p>Pimlico and its licensors own all right, title and interest (including IPR) in and to:</p>
            <ul className="list-disc ml-6 mt-3 space-y-2">
              <li>the XHS™ Service, Documentation and underlying software;</li>
              <li>the Materials (including all reports, templates, data models and analyses produced by Pimlico, whether standard or bespoke); and</li>
              <li>all modifications, enhancements and derivative works of the foregoing,</li>
            </ul>
            <p className="mt-3">
              in each case excluding Customer Data. No ownership rights are transferred to Customer under these Terms; only the limited licences set out herein are granted.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">10.2 Customer IPR</h3>
            <p>
              Customer retains ownership of all IPR in Customer Data and any items supplied by Customer to Pimlico. Customer grants Pimlico the licences described in clause 7.3.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">10.3 Use of Pimlico marks</h3>
            <p>
              Customer shall not use any Pimlico trade marks, logos or branding except as expressly permitted in writing by Pimlico.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">10.4 Feedback</h3>
            <p>
              If Customer or its Authorised Users provide feedback, ideas or suggestions regarding the XHS™ Service or any other Services (Feedback), Pimlico may use such Feedback without restriction and without obligation to Customer. Customer assigns (or shall procure assignment of) all rights in Feedback to Pimlico to the fullest extent permitted by law.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">10.5 IPR indemnity</h3>
            <p>
              Pimlico shall defend Customer against any claim by a third party that Customer's authorised use of the XHS™ Service or standard Materials in accordance with these Terms infringes that third party's IPR in the United Kingdom, and shall pay any damages, costs and expenses finally awarded against Customer by a court of competent jurisdiction or agreed in settlement, provided that Customer:
            </p>
            <ul className="list-disc ml-6 mt-3 space-y-2">
              <li>promptly notifies Pimlico in writing of the claim;</li>
              <li>allows Pimlico sole control of the defence and settlement of the claim; and</li>
              <li>provides all reasonable co-operation at Pimlico's expense.</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">10.6 IPR indemnity exceptions and remedies</h3>
            <p>Pimlico shall have no liability under clause 10.5 to the extent the claim arises from:</p>
            <ul className="list-disc ml-6 mt-3 space-y-2">
              <li>Customer Data;</li>
              <li>Customer's combination of the Services or Materials with products, services or data not supplied or authorised in writing by Pimlico;</li>
              <li>Customer's use of the Services in breach of these Terms; or</li>
              <li>use of an outdated version of the XHS™ Service where the claim could have been avoided by using a version or configuration provided by Pimlico.</li>
            </ul>
            <p className="mt-4">If a claim is made or threatened, Pimlico may, at its option and expense:</p>
            <ul className="list-disc ml-6 mt-3 space-y-2">
              <li>procure for Customer the right to continue using the affected Services;</li>
              <li>modify the Services so they are non-infringing without materially reducing functionality; or</li>
              <li>terminate the affected Services and refund a pro-rata portion of pre-paid fees for the unused remainder of the Subscription Term.</li>
            </ul>
            <p className="mt-4">
              This clause 10.6 states Customer's sole and exclusive remedy in respect of any IPR infringement claim relating to the Services or Materials.
            </p>
          </section>

          <hr className="my-12 border-gray-200" />

          {/* Section 11 */}
          <section>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-6">11. Confidentiality</h2>
            
            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">11.1 Confidential Information</h3>
            <p>
              "Confidential Information" means all information disclosed by or on behalf of one party (Disclosing Party) to the other party (Receiving Party) in connection with the Contract that is either marked or identified as confidential or that would reasonably be understood to be confidential given the nature of the information and circumstances of disclosure. Pimlico's Confidential Information includes the Services, Materials, Documentation, pricing and any non-public technical or business information. Customer's Confidential Information includes Customer Data that is not publicly available.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">11.2 Obligations</h3>
            <p>The Receiving Party shall:</p>
            <ul className="list-disc ml-6 mt-3 space-y-2">
              <li>use the Disclosing Party's Confidential Information only for the purposes of performing or receiving the Services under the Contract;</li>
              <li>not disclose the Confidential Information to any third party except to its employees, contractors or professional advisers who have a need to know and are bound by obligations of confidentiality no less protective than those in these Terms; and</li>
              <li>protect the Confidential Information using at least the same degree of care it uses to protect its own similar information, and in any event not less than reasonable care.</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">11.3 Exceptions</h3>
            <p>The obligations in clause 11.2 do not apply to information that:</p>
            <ul className="list-disc ml-6 mt-3 space-y-2">
              <li>is or becomes public through no fault of the Receiving Party;</li>
              <li>was lawfully known to the Receiving Party before disclosure;</li>
              <li>is lawfully received from a third party without breach of any duty of confidence; or</li>
              <li>is independently developed by the Receiving Party without use of or reference to the Disclosing Party's Confidential Information.</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">11.4 Required disclosure</h3>
            <p>
              The Receiving Party may disclose Confidential Information if required by law, court order or regulatory authority, provided it (where lawful to do so) gives the Disclosing Party reasonable advance notice and co-operates (at the Disclosing Party's expense) in any effort to resist or limit such disclosure.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">11.5 Equitable relief</h3>
            <p>
              Unauthorised disclosure or use of Confidential Information may cause irreparable harm. Without prejudice to any other rights or remedies, the Disclosing Party is entitled to seek injunctive or other equitable relief for any breach of this clause 11.
            </p>
          </section>

          <hr className="my-12 border-gray-200" />

          {/* Section 12 */}
          <section>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-6">12. Data protection and privacy</h2>
            
            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">12.1 Roles</h3>
            <p>
              The parties acknowledge that, in providing the XHS™ Service, Pimlico may process personal data on behalf of Customer. Where Pimlico acts as a processor and Customer as controller (as defined in the UK General Data Protection Regulation and the Data Protection Act 2018), the parties shall comply with their respective obligations, and Pimlico shall process personal data only on Customer's documented instructions.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">12.2 Data processing terms</h3>
            <p>
              Where required by applicable data protection laws, the parties shall enter into a separate data processing agreement or addendum, which shall form part of the Contract. In the event of any conflict between these Terms and such data processing agreement in relation to the processing of personal data, the data processing agreement shall prevail.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">12.3 Privacy Policy</h3>
            <p>
              Any personal data provided to Pimlico will be handled in accordance with Pimlico's Privacy Policy as updated from time to time and accessible via the XHS™ website.
            </p>
          </section>

          <hr className="my-12 border-gray-200" />

          {/* Section 13 */}
          <section>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-6">13. Warranties and disclaimers</h2>
            
            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">13.1 Mutual warranties</h3>
            <p>Each party warrants that:</p>
            <ul className="list-disc ml-6 mt-3 space-y-2">
              <li>it has full power and authority to enter into and perform the Contract; and</li>
              <li>entering into and performing the Contract will not cause it to breach any other agreement or legal obligation.</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">13.2 Service warranty</h3>
            <p>
              Pimlico will provide the Services with reasonable skill and care and in material accordance with the Documentation.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">13.3 Beta or trial features</h3>
            <p>
              From time to time, Pimlico may make preview, beta or trial features or modules of the XHS™ Copilot (including AI-powered functionality measured in AI Credits) available. Such features are provided "as is" without warranty, may be changed, suspended or withdrawn at any time and are not subject to any service level or support commitments. For Beta Customers, the Beta Period and any waiver of AI Credit Usage Fees are as described in clauses 1 and 8.4. All other Terms continue to apply in full during any beta, pilot or early-access use.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">13.4 Exclusions</h3>
            <p>Except as expressly stated in these Terms, and to the fullest extent permitted by law:</p>
            <ul className="list-disc ml-6 mt-3 space-y-2">
              <li>the Services and Materials are provided "as is";</li>
              <li>Pimlico does not warrant that the Services will be uninterrupted or error-free, or that they will meet Customer's specific requirements;</li>
              <li>Pimlico gives no warranty as to the accuracy, completeness or currency of any particular piece of information within the Materials, or that any particular regulatory, compliance or commercial outcome will be achieved; and</li>
              <li>all warranties, terms and conditions implied by statute, common law or otherwise (including implied warranties of satisfactory quality, fitness for a particular purpose and non-infringement) are excluded.</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">13.5 Customer warranties</h3>
            <p>Customer warrants that:</p>
            <ul className="list-disc ml-6 mt-3 space-y-2">
              <li>it has and will maintain all rights, licences and consents necessary to provide Customer Data and to use the Services;</li>
              <li>its use of the Services and the Customer Data will not infringe any third-party rights or violate any applicable law; and</li>
              <li>it will use reasonable professional standards in relying on and applying outputs from the XHS™ Service, and will not treat any Materials as a substitute for independent professional advice.</li>
            </ul>
          </section>

          <hr className="my-12 border-gray-200" />

          {/* Section 14 */}
          <section>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-6">14. Indemnities</h2>
            
            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">14.1 Customer indemnity</h3>
            <p>
              Customer shall indemnify and keep indemnified Pimlico from and against all losses, damages, costs (including reasonable legal fees) and expenses arising out of any third-party claim relating to:
            </p>
            <ul className="list-disc ml-6 mt-3 space-y-2">
              <li>Customer Data (including allegations that Customer Data infringes any IPR or privacy rights or is otherwise unlawful);</li>
              <li>Customer's use of the Services in breach of these Terms or applicable law; or</li>
              <li>any combination of the Services with third-party products or services not supplied or authorised by Pimlico that gives rise to the claim.</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">14.2 Procedure</h3>
            <p>Pimlico shall:</p>
            <ul className="list-disc ml-6 mt-3 space-y-2">
              <li>promptly notify Customer of any claim for which it seeks indemnity;</li>
              <li>allow Customer sole control of the defence and settlement of the claim (provided that Customer shall not settle any claim in a way that imposes any admission of liability or non-monetary obligation on Pimlico without Pimlico's prior written consent); and</li>
              <li>provide reasonable co-operation at Customer's expense.</li>
            </ul>
          </section>

          <hr className="my-12 border-gray-200" />

          {/* Section 15 */}
          <section>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-6">15. Limitation of liability</h2>
            
            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">15.1 Non-excludable liability</h3>
            <p>Nothing in these Terms limits or excludes either party's liability for:</p>
            <ul className="list-disc ml-6 mt-3 space-y-2">
              <li>death or personal injury caused by negligence;</li>
              <li>fraud or fraudulent misrepresentation; or</li>
              <li>any other liability that cannot be excluded or limited under applicable law.</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">15.2 Excluded types of loss</h3>
            <p>
              Subject to clause 15.1, neither party shall be liable to the other (whether in contract, tort, negligence, misrepresentation, restitution or otherwise) for:
            </p>
            <ul className="list-disc ml-6 mt-3 space-y-2">
              <li>loss of profits, revenue or anticipated savings;</li>
              <li>loss of business, contracts or opportunity;</li>
              <li>loss of or damage to goodwill or reputation;</li>
              <li>loss or corruption of data; or</li>
              <li>any indirect, consequential or special loss or damage,</li>
            </ul>
            <p className="mt-3">in each case arising out of or in connection with the Contract, even if foreseeable.</p>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">15.3 Overall cap</h3>
            <p>
              Subject to clauses 15.1 and 15.2, Pimlico's total aggregate liability to Customer arising out of or in connection with the Contract (whether in contract, tort, negligence, misrepresentation, restitution or otherwise) in any 12-month period shall be limited to the total fees paid by Customer to Pimlico under the Contract in that 12-month period.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">15.4 Customer responsibility</h3>
            <p>Customer acknowledges that:</p>
            <ul className="list-disc ml-6 mt-3 space-y-2">
              <li>it is solely responsible for how it interprets and applies the Materials and outputs of the XHS™ Service; and</li>
              <li>it must not rely on the XHS™ Service as the sole basis for regulatory, legal or strategic decision-making.</li>
            </ul>
          </section>

          <hr className="my-12 border-gray-200" />

          {/* Section 16 */}
          <section>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-6">16. Service changes, maintenance and updates</h2>
            
            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">16.1 Service changes</h3>
            <p>
              Pimlico may improve, update or modify the XHS™ Service from time to time (including adding, removing or changing features or content), provided that such changes do not materially reduce the overall functionality of the Services purchased by Customer during the then-current Subscription Term. Where Pimlico intends to make a change that would materially reduce such functionality, it will give Customer reasonable prior notice and Customer may exercise its rights under clause 9.4.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">16.2 Changes to these Terms</h3>
            <p>
              Pimlico may amend these Terms from time to time. For existing Customers, material changes will normally take effect from the start of the next renewal Subscription Term, unless a change is required earlier by law, regulation or a regulator. Pimlico will notify Customer of any material change in a reasonable manner (for example by email or via the XHS™ Service interface).
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">16.3 Planned maintenance</h3>
            <p>
              Pimlico may carry out scheduled maintenance which may cause temporary unavailability. Pimlico will use reasonable efforts to schedule such maintenance outside normal business hours and to give advance notice via the XHS™ Service or email.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">16.4 Emergency maintenance</h3>
            <p>
              Pimlico may carry out emergency maintenance without prior notice where necessary to address urgent security or stability issues, and will use reasonable efforts to minimise disruption.
            </p>
          </section>

          <hr className="my-12 border-gray-200" />

          {/* Section 17 */}
          <section>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-6">17. Force majeure</h2>
            <p>
              Neither party shall be liable for any delay or failure in performing its obligations (other than payment obligations) to the extent such delay or failure is caused by events beyond its reasonable control, including but not limited to acts of God, natural disasters, epidemics or pandemics, war, terrorism, civil commotion, strikes or other industrial disputes, failure of utilities or telecommunications, or governmental restrictions. The affected party shall use reasonable endeavours to mitigate the effects of such events.
            </p>
          </section>

          <hr className="my-12 border-gray-200" />

          {/* Section 18 */}
          <section>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-6">18. Compliance, notices and general</h2>
            
            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">18.1 Anti-bribery, sanctions and export</h3>
            <p>
              Customer shall comply with all applicable anti-bribery, anti-corruption, sanctions and export control laws, including the UK Bribery Act 2010 and any applicable local laws. Customer shall not use the XHS™ Service in any country or territory, or for the benefit of any individual or entity, in breach of such laws or applicable sanctions.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">18.2 Assignment</h3>
            <p>
              Customer may not assign, transfer or sub-contract any of its rights or obligations under the Contract without Pimlico's prior written consent (not to be unreasonably withheld). Pimlico may assign or transfer its rights and obligations under the Contract to an Affiliate or in connection with a merger, acquisition or sale of substantially all of its assets relating to the Services.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">18.3 Third-party rights</h3>
            <p>
              The Contract is not intended to confer any rights on any third party, and no person other than the parties shall have any rights under the Contracts (Rights of Third Parties) Act 1999 to enforce any of its terms.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">18.4 Relationship of the parties</h3>
            <p>
              Nothing in the Contract is intended to or shall operate to create a partnership, joint venture, agency or employment relationship between the parties. Neither party has authority to bind the other in any way.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">18.5 Entire agreement</h3>
            <p>
              The Contract constitutes the entire agreement between the parties regarding its subject matter and supersedes all prior agreements, arrangements and understandings. Each party acknowledges that in entering into the Contract it does not rely on any statement, representation or warranty not set out in the Contract.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">18.6 Severance</h3>
            <p>
              If any provision of the Contract is held to be invalid, illegal or unenforceable, it shall be deemed modified to the minimum extent necessary to make it valid, legal and enforceable. If such modification is not possible, the relevant provision shall be deemed deleted. Any such modification or deletion shall not affect the validity of the remaining provisions.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">18.7 Waiver</h3>
            <p>
              A failure or delay by either party to exercise any right or remedy under the Contract shall not constitute a waiver of that or any other right or remedy. A waiver of any right or remedy shall be effective only if in writing and signed by the waiving party.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">18.8 Notices and contact details</h3>
            <p>Formal notices under the Contract must be in writing and sent:</p>
            <ul className="list-disc ml-6 mt-3 space-y-2">
              <li>by hand or pre-paid recorded delivery post to the registered office or principal place of business of the recipient; or</li>
              <li>by email to the email address specified in the Order Form (or, for Pimlico, to <strong>contact@pimlicosolutions.com</strong>, or such other address Pimlico notifies).</li>
            </ul>
            <p className="mt-4">
              Notices sent by post are deemed received two business days after posting within the UK (or five business days if sent internationally). Notices sent by email are deemed received at the time of transmission, provided no delivery failure notice is received.
            </p>
            <p className="mt-4">
              If you have any questions about these Terms, you may contact Pimlico at <strong>contact@pimlicosolutions.com</strong>.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">18.9 Governing law and jurisdiction</h3>
            <p>
              The Contract and any dispute or claim arising out of or in connection with it (including non-contractual disputes or claims) shall be governed by and construed in accordance with the laws of England and Wales, and the parties submit to the exclusive jurisdiction of the courts of England and Wales.
            </p>
          </section>

          <hr className="my-12 border-gray-200" />

          <div className="mt-16 text-center text-sm text-gray-500">
            <p>© {new Date().getFullYear()} Pimlico Solutions Ltd. All rights reserved.</p>
            <p className="mt-2">Company Number: 16505294</p>
            <p className="mt-1">71–75 Shelton Street, Covent Garden, London, United Kingdom, WC2H 9JQ</p>
          </div>
        </div>
      </div>
    </div>
  )
}
