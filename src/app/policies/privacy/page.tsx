import { PolicyLayout, ContactBlock } from "@/components/layout/PolicyLayout/PolicyLayout";
import { brand } from "@/lib/brand";

export const metadata = { title: "Privacy Policy — UltraSensSkin" };

export default function PrivacyPolicyPage() {
  return (
    <PolicyLayout title="Privacy Policy" lastUpdated="9 August 2026">
      <p>
        This Privacy Policy explains how {brand.company.legalName} collects, uses, stores and shares personal data when you
        access or use ultrasensskin.com, create an account, sign in through Steam, purchase a Digital Item, receive
        a Steam Trade Offer, or contact us.
      </p>
      <p>The Service is operated by:</p>
      <ContactBlock />
      <p>
        For the purposes of the General Data Protection Regulation (&ldquo;GDPR&rdquo;), {brand.company.legalName} is the
        controller of the personal data described in this Privacy Policy, except where another organisation
        processes personal data as an independent controller.
      </p>
      <p>
        In this Policy, &ldquo;UltraSensSkin&rdquo;, &ldquo;ULTRASENS&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;
        and &ldquo;our&rdquo; refer to {brand.company.legalName}. &ldquo;You&rdquo; and &ldquo;your&rdquo; refer to the
        individual using the Service.
      </p>

      <h2>1. Scope</h2>
      <p>This Privacy Policy applies to personal data processed through:</p>
      <ul>
        <li>ultrasensskin.com;</li>
        <li>your UltraSensSkin Account;</li>
        <li>Steam Login;</li>
        <li>the purchase and delivery process;</li>
        <li>payment and fraud-prevention processes;</li>
        <li>Steam Trade Offers;</li>
        <li>customer support; and</li>
        <li>related security and compliance activities.</li>
      </ul>
      <p>
        This Policy does not govern Steam, card issuers, payment service providers or other independent
        third-party services. Those organisations may process personal data under their own privacy documentation.
      </p>

      <h2>2. Data Controller</h2>
      <p>The controller responsible for the processing described in this Policy is:</p>
      <ContactBlock />
      <p>Privacy questions and requests may be sent to {brand.contact.email}.</p>
      <p>ULTRASENS has not appointed a data protection officer unless updated contact information is published through the Service.</p>

      <h2>3. Minimum Age</h2>
      <p>The Service is available only to individuals who are at least 18 years old.</p>
      <p>
        We do not knowingly collect personal data from children. If we reasonably believe that an individual under
        18 has created an Account or used the Service, we may close the Account and delete or restrict the relevant
        data, except where retention is legally required.
      </p>
      <p>If you believe that a minor has provided personal data to us, contact {brand.contact.email}.</p>

      <h2>4. Categories of Personal Data</h2>
      <p>Depending on how you use the Service, we may process the following categories of personal data.</p>
      <h3>4.1 Steam account data</h3>
      <p>When you sign in through Steam or connect a Steam Account, we may receive or access:</p>
      <ul>
        <li>your unique SteamID;</li>
        <li>Steam profile name;</li>
        <li>avatar and profile URL;</li>
        <li>profile visibility status;</li>
        <li>country or location information made public through Steam;</li>
        <li>public inventory information;</li>
        <li>information concerning Digital Items in the public inventory;</li>
        <li>Steam trading eligibility or restriction status;</li>
        <li>information necessary to verify that the Trade URL matches the connected Steam Account; and</li>
        <li>
          other public Steam profile information where technically returned by Steam and reasonably necessary to
          provide or secure the Service.
        </li>
      </ul>
      <p>
        Steam Login does not provide us with your Steam password. We do not ask you to disclose your Steam
        password, Steam Guard code, API key or account recovery code.
      </p>
      <p>
        We do not intentionally collect unrelated information about your Steam friends, gameplay history,
        achievements or community activity unless such information is technically returned, publicly available and
        reasonably necessary for security or a specific Service feature.
      </p>
      <h3>4.2 Account and contact data</h3>
      <p>We may process:</p>
      <ul>
        <li>email address, if provided during registration, checkout or support;</li>
        <li>Account identifier;</li>
        <li>Account creation and login dates;</li>
        <li>selected language and currency;</li>
        <li>Account status;</li>
        <li>consent and policy acceptance records;</li>
        <li>country of residence or access;</li>
        <li>age or eligibility confirmation; and</li>
        <li>information you provide when updating or securing your Account.</li>
      </ul>
      <h3>4.3 Trade URL and delivery data</h3>
      <p>To deliver a purchased Digital Item, we may process:</p>
      <ul>
        <li>Steam Trade URL;</li>
        <li>receiving SteamID;</li>
        <li>sending SteamID;</li>
        <li>Trade Offer ID;</li>
        <li>Trade Offer status;</li>
        <li>offer creation, acceptance, rejection and expiry timestamps;</li>
        <li>Digital Item asset identifiers;</li>
        <li>delivery status;</li>
        <li>Steam trade history relevant to the Order;</li>
        <li>applicable Steam trade restrictions; and</li>
        <li>technical records showing whether delivery was completed.</li>
      </ul>
      <h3>4.4 Order and transaction data</h3>
      <p>When you place an Order, we may process:</p>
      <ul>
        <li>Order number;</li>
        <li>selected Digital Item;</li>
        <li>item name, type and characteristics;</li>
        <li>item float value, pattern, wear, stickers or other relevant attributes;</li>
        <li>price;</li>
        <li>currency;</li>
        <li>VAT and invoice information;</li>
        <li>Order date and time;</li>
        <li>Order status;</li>
        <li>cancellation and refund records;</li>
        <li>transaction correspondence; and</li>
        <li>records needed to establish, perform or defend the purchase contract.</li>
      </ul>
      <h3>4.5 Payment data</h3>
      <p>Card payments are processed with the assistance of authorised payment service providers.</p>
      <p>Depending on the payment process, we may receive:</p>
      <ul>
        <li>payment status;</li>
        <li>payment transaction reference;</li>
        <li>amount and currency;</li>
        <li>card network;</li>
        <li>limited masked card information, such as the last four digits;</li>
        <li>card issuer country;</li>
        <li>authentication status;</li>
        <li>fraud or risk indicators;</li>
        <li>refund status; and</li>
        <li>chargeback or payment dispute information.</li>
      </ul>
      <p>We do not intend to receive or store:</p>
      <ul>
        <li>complete card numbers;</li>
        <li>CVV or CVC security codes;</li>
        <li>card PINs; or</li>
        <li>online banking credentials.</li>
      </ul>
      <p>Complete payment information may be collected directly by the payment service provider under its own privacy documentation.</p>
      <h3>4.6 Technical and security data</h3>
      <p>When you access or use the Service, our systems or infrastructure providers may automatically process:</p>
      <ul>
        <li>IP address;</li>
        <li>approximate country or region derived from the IP address;</li>
        <li>browser type and version;</li>
        <li>device type;</li>
        <li>operating system;</li>
        <li>language and time-zone settings;</li>
        <li>session identifier;</li>
        <li>login time;</li>
        <li>pages or Service functions requested;</li>
        <li>error and diagnostic data;</li>
        <li>security events;</li>
        <li>fraud-prevention signals; and</li>
        <li>server and access logs.</li>
      </ul>
      <p>
        This information is used to operate and secure the Service, enforce geographic restrictions, diagnose
        technical problems and prevent abuse.
      </p>
      <p>
        At the date of publication, UltraSensSkin does not use third-party advertising cookies, behavioural
        advertising tools, marketing pixels or third-party analytics tools.
      </p>
      <h3>4.7 Communications and support data</h3>
      <p>When you contact us, we may process:</p>
      <ul>
        <li>your name or Account identifier;</li>
        <li>email address;</li>
        <li>SteamID;</li>
        <li>Order number;</li>
        <li>the contents of your message;</li>
        <li>attachments and screenshots;</li>
        <li>complaint or refund information;</li>
        <li>our response; and</li>
        <li>related internal support notes.</li>
      </ul>
      <p>Please do not provide passwords, authentication codes, full card details or unrelated sensitive information in support communications.</p>
      <h3>4.8 Compliance and verification data</h3>
      <p>Where reasonably necessary for fraud prevention, legal compliance or transaction security, we may request or receive:</p>
      <ul>
        <li>confirmation of age;</li>
        <li>confirmation of country or residence;</li>
        <li>payment authorisation evidence;</li>
        <li>information concerning a disputed payment;</li>
        <li>sanctions-screening results;</li>
        <li>account ownership evidence; or</li>
        <li>other information proportionate to a specific security or legal concern.</li>
      </ul>
      <p>We will not claim to perform a specific identity verification procedure unless that procedure is actually implemented for the relevant transaction.</p>
      <h3>4.9 Special-category data</h3>
      <p>
        We do not intentionally request or process data revealing racial or ethnic origin, political opinions,
        religious beliefs, health information, sexual orientation, biometric identifiers or other special
        categories of personal data.
      </p>
      <p>Do not send such information unless it is strictly necessary for a legal claim and has been specifically requested through an appropriate secure process.</p>

      <h2>5. Sources of Personal Data</h2>
      <p>We may obtain personal data:</p>
      <ul>
        <li>directly from you;</li>
        <li>from Steam through Steam Login, Steam APIs or publicly available Steam information;</li>
        <li>from payment service providers, card networks or financial institutions;</li>
        <li>from Fulfilment Providers involved in delivering an Order;</li>
        <li>automatically from browsers, devices, servers and security systems;</li>
        <li>from support communications;</li>
        <li>from fraud-prevention or compliance service providers; and</li>
        <li>from competent authorities or public sources where permitted by law.</li>
      </ul>

      <h2>6. Purposes and Legal Bases</h2>
      <p>We process personal data only where we have an applicable legal basis.</p>
      <h3>6.1 Providing the Service and performing a contract</h3>
      <p>Under Article 6(1)(b) GDPR, we process data where necessary to:</p>
      <ul>
        <li>create and administer your Account;</li>
        <li>authenticate you through Steam;</li>
        <li>display relevant Digital Items;</li>
        <li>receive and process an Order;</li>
        <li>process payment status;</li>
        <li>issue an Order Confirmation and invoice;</li>
        <li>arrange and verify delivery;</li>
        <li>send or facilitate a Trade Offer;</li>
        <li>handle cancellation or refund requests;</li>
        <li>provide customer support; and</li>
        <li>otherwise perform the purchase contract.</li>
      </ul>
      <p>Without the data required for these purposes, we may be unable to create an Account, accept an Order or deliver an Item.</p>
      <h3>6.2 Compliance with legal obligations</h3>
      <p>Under Article 6(1)(c) GDPR, we may process data to:</p>
      <ul>
        <li>maintain accounting and tax records;</li>
        <li>issue legally required invoices;</li>
        <li>respond to valid authority requests;</li>
        <li>comply with consumer protection requirements;</li>
        <li>comply with sanctions and other applicable restrictions;</li>
        <li>manage legally required retention;</li>
        <li>investigate and report unlawful activity where required; and</li>
        <li>comply with court orders and other binding legal processes.</li>
      </ul>
      <h3>6.3 Legitimate interests</h3>
      <p>
        Under Article 6(1)(f) GDPR, we may process data where necessary for our legitimate interests or those of
        another person, provided that those interests are not overridden by your rights and freedoms.
      </p>
      <p>These interests may include:</p>
      <ul>
        <li>preventing fraud, phishing and payment abuse;</li>
        <li>protecting Accounts, users and the Service;</li>
        <li>enforcing geographic restrictions;</li>
        <li>investigating unauthorised activity;</li>
        <li>maintaining reliable transaction and delivery records;</li>
        <li>detecting technical errors;</li>
        <li>improving security and operational reliability;</li>
        <li>preventing duplicate or improper refunds;</li>
        <li>establishing, exercising or defending legal claims;</li>
        <li>protecting our contractual rights; and</li>
        <li>communicating about security or administrative matters.</li>
      </ul>
      <p>You may object to processing based on legitimate interests as described in Section 14.</p>
      <h3>6.4 Consent</h3>
      <p>Under Article 6(1)(a) GDPR, we may process data based on consent where consent is legally required.</p>
      <p>This may apply to:</p>
      <ul>
        <li>non-essential cookies, if introduced;</li>
        <li>optional communications;</li>
        <li>optional Service features; or</li>
        <li>another clearly identified purpose.</li>
      </ul>
      <p>At the date of publication, UltraSensSkin does not use personal data for behavioural advertising or third-party analytics.</p>
      <p>Where processing is based on consent, you may withdraw that consent at any time. Withdrawal does not affect processing that occurred before consent was withdrawn.</p>
      <h3>6.5 Legal claims and unlawful activity</h3>
      <p>Where necessary, personal data may also be processed to establish, exercise or defend legal claims, prevent unlawful activity, or protect the rights and safety of users, ULTRASENS and third parties.</p>

      <h2>7. Steam Login</h2>
      <p>Steam Login allows us to authenticate your SteamID without receiving your Steam password.</p>
      <p>When you use Steam Login:</p>
      <ul>
        <li>you are redirected to or interact with Steam;</li>
        <li>Steam authenticates your credentials;</li>
        <li>Steam returns an identifier confirming the relevant Steam Account; and</li>
        <li>we may retrieve public Steam profile information needed for the Service.</li>
      </ul>
      <p>Steam acts independently in relation to its own authentication systems and processing activities. Your use of Steam remains subject to Steam&rsquo;s terms and privacy documentation.</p>
      <p>You should access Steam Login only through an official Steam domain and must never provide Steam credentials directly to UltraSensSkin or a Fulfilment Provider.</p>

      <h2>8. Payment Processing</h2>
      <p>Payments are processed through authorised third-party payment service providers.</p>
      <p>A payment provider may process:</p>
      <ul>
        <li>cardholder name;</li>
        <li>billing address;</li>
        <li>complete card details;</li>
        <li>authentication data;</li>
        <li>device and IP information;</li>
        <li>fraud-prevention signals; and</li>
        <li>other information required to authorise or process the payment.</li>
      </ul>
      <p>The payment provider may act as our processor for some activities and as an independent controller for regulatory, fraud-prevention and financial compliance activities.</p>
      <p>We may change payment providers without changing the purposes described in this Policy. The identity of a particular provider may be made available during checkout, through the payment interface, or upon a valid data protection request where required by law.</p>

      <h2>9. Digital Item Supply and Fulfilment Providers</h2>
      <p>Delivery may be performed by a confidential Digital Item supplier, inventory provider, bot operator or current holder of the Item.</p>
      <p>To complete and verify delivery, we may provide a Fulfilment Provider with:</p>
      <ul>
        <li>SteamID;</li>
        <li>Trade URL;</li>
        <li>internal Order identifier;</li>
        <li>selected Digital Item and asset information;</li>
        <li>delivery instructions;</li>
        <li>relevant Trade Offer information; and</li>
        <li>delivery status.</li>
      </ul>
      <p>Fulfilment Providers are not permitted to receive your Steam password, Steam Guard code, full card information or unrelated personal data from us.</p>
      <p>The commercial identity of a Fulfilment Provider may remain confidential. However, this does not restrict any right you have under applicable data protection law to receive information about actual recipients of your personal data where disclosure is legally required.</p>

      <h2>10. Other Recipients of Personal Data</h2>
      <p>We may disclose personal data to the following categories of recipients where necessary:</p>
      <ul>
        <li>payment service providers;</li>
        <li>card networks, banks and card issuers;</li>
        <li>Digital Item supply and fulfilment providers;</li>
        <li>hosting, infrastructure and security providers;</li>
        <li>IT maintenance and technical service providers;</li>
        <li>email and communication providers;</li>
        <li>accountants, auditors, lawyers and other professional advisers;</li>
        <li>insurers;</li>
        <li>fraud-prevention and compliance providers;</li>
        <li>courts, regulators, law enforcement and other authorities;</li>
        <li>a purchaser, investor or successor in connection with a genuine corporate transaction; and</li>
        <li>other persons where you have instructed or authorised us to disclose the data.</li>
      </ul>
      <p>Service providers may access personal data only to the extent necessary for the relevant service and must be subject to appropriate confidentiality and data protection obligations.</p>
      <p>We do not sell personal data or share it for third-party behavioural advertising.</p>

      <h2>11. International Data Transfers</h2>
      <p>Steam, payment providers, Fulfilment Providers or infrastructure providers may operate in countries outside Lithuania or the European Economic Area (&ldquo;EEA&rdquo;).</p>
      <p>Where personal data is transferred outside the EEA, we will ensure that the transfer has a lawful basis and appropriate safeguards where required. These may include:</p>
      <ul>
        <li>an adequacy decision adopted by the European Commission;</li>
        <li>the European Commission&rsquo;s Standard Contractual Clauses;</li>
        <li>supplementary contractual, organisational or technical measures;</li>
        <li>another legally recognised transfer mechanism; or</li>
        <li>a specific GDPR derogation where applicable.</li>
      </ul>
      <p>You may contact us for information about the safeguards applicable to a particular transfer. Some information may be redacted where necessary to protect security, confidentiality or third-party rights, without restricting the substance of your legal rights.</p>

      <h2>12. Data Retention</h2>
      <p>We retain personal data only for as long as reasonably necessary for the purposes described in this Policy, including legal, accounting, security and dispute-resolution requirements.</p>
      <p>The applicable retention criteria include:</p>
      <h3>Account and Steam profile data</h3>
      <p>Retained while the Account is active and for a limited period after closure where necessary to prevent fraud, process remaining requests, resolve disputes or establish legal claims. Public Steam profile information may be refreshed, replaced or deleted when no longer needed.</p>
      <h3>Trade URL</h3>
      <p>Retained while needed for active or reasonably anticipated deliveries. A replaced Trade URL may remain in historical security or transaction records where necessary to investigate a completed or disputed Order.</p>
      <h3>Order, invoice and payment records</h3>
      <p>Retained for the period required by Lithuanian accounting, tax, consumer protection and other applicable laws, and for the period necessary to manage disputes, refunds or legal claims.</p>
      <h3>Trade and delivery records</h3>
      <p>Retained for as long as reasonably necessary to prove delivery, investigate reversals, prevent duplicate refunds, resolve payment disputes and establish or defend legal claims.</p>
      <h3>Technical and security logs</h3>
      <p>Retained for a limited security and diagnostic period. Relevant logs may be retained longer where connected to suspected fraud, a security incident, a disputed transaction or legal proceedings.</p>
      <h3>Support communications</h3>
      <p>Retained until the request is resolved and for a reasonable period afterwards where necessary to maintain service history, handle follow-up complaints or defend legal claims.</p>
      <h3>Compliance information</h3>
      <p>Retained only for as long as necessary for the applicable review, legal obligation, restriction or investigation.</p>
      <p>When retention is no longer necessary, data will be deleted, anonymised or securely isolated unless continued retention is legally required.</p>

      <h2>13. Automated Processing</h2>
      <p>Payment providers and security systems may use automated tools to identify suspicious activity, assess transaction risk or approve or decline a payment.</p>
      <p>UltraSensSkin does not currently use personal data for behavioural advertising or profiling unrelated to transaction security.</p>
      <p>We do not intend to make decisions based solely on automated processing that produce legal or similarly significant effects, except where:</p>
      <ul>
        <li>the processing is necessary to enter into or perform a contract;</li>
        <li>the processing is authorised by law;</li>
        <li>you have provided explicit consent where legally permitted; or</li>
        <li>the decision is made independently by a payment provider under its own legal responsibilities.</li>
      </ul>
      <p>Where applicable law provides such a right, you may request human review, express your point of view and contest an automated decision by contacting us.</p>

      <h2>14. Your Data Protection Rights</h2>
      <p>Subject to applicable law, you may have the following rights.</p>
      <h3>14.1 Right of access</h3>
      <p>You may ask whether we process your personal data and request a copy of that data, together with information about its processing.</p>
      <h3>14.2 Right to rectification</h3>
      <p>You may ask us to correct inaccurate personal data or complete incomplete data. Some Steam information must be corrected through Steam before the updated information can be retrieved by UltraSensSkin.</p>
      <h3>14.3 Right to erasure</h3>
      <p>You may ask us to delete personal data where:</p>
      <ul>
        <li>it is no longer necessary;</li>
        <li>consent has been withdrawn and no other legal basis applies;</li>
        <li>you have successfully objected to the processing;</li>
        <li>the data was processed unlawfully; or</li>
        <li>deletion is required by law.</li>
      </ul>
      <p>The right to erasure does not apply where retention remains necessary for legal compliance, accounting, fraud prevention, legal claims or another lawful purpose.</p>
      <h3>14.4 Right to restriction</h3>
      <p>You may ask us to restrict processing while:</p>
      <ul>
        <li>data accuracy is being verified;</li>
        <li>an objection is being considered;</li>
        <li>the processing is unlawful but you oppose deletion; or</li>
        <li>we no longer need the data but you require it for a legal claim.</li>
      </ul>
      <h3>14.5 Right to data portability</h3>
      <p>Where processing is based on consent or contract and performed by automated means, you may request relevant personal data in a structured, commonly used and machine-readable format.</p>
      <h3>14.6 Right to object</h3>
      <p>You may object to processing based on legitimate interests. We will stop the relevant processing unless we demonstrate compelling legitimate grounds that override your interests, rights and freedoms, or the processing remains necessary for legal claims.</p>
      <p>You may object to direct marketing at any time. UltraSensSkin does not currently send behavioural advertising or share data for such advertising.</p>
      <h3>14.7 Right to withdraw consent</h3>
      <p>Where processing is based on consent, you may withdraw that consent at any time. Withdrawal does not affect the lawfulness of processing performed before withdrawal.</p>
      <h3>14.8 Right concerning automated decisions</h3>
      <p>Where applicable, you may request human intervention and contest a decision based solely on automated processing that produces legal or similarly significant effects.</p>
      <h3>14.9 Right to complain</h3>
      <p>You may lodge a complaint with the supervisory authority in Lithuania or, where applicable, the authority in the EEA country of your habitual residence, place of work or alleged infringement.</p>

      <h2>15. Exercising Your Rights</h2>
      <p>Requests may be sent to: {brand.contact.email}</p>
      <p>Please use the subject line &ldquo;Data Protection Request&rdquo;.</p>
      <p>Your request should identify:</p>
      <ul>
        <li>your SteamID or Account identifier;</li>
        <li>the right you wish to exercise;</li>
        <li>the information or processing concerned; and</li>
        <li>an email address through which we can respond.</li>
      </ul>
      <p>We may request proportionate information to verify your identity and protect the Account from unauthorised disclosure.</p>
      <p>We will respond without undue delay and normally within one month after receiving a valid request. That period may be extended by up to two additional months where permitted because of the complexity or number of requests. If an extension is required, we will inform you.</p>
      <p>Requests are normally handled free of charge. A reasonable fee may be charged, or a request may be refused, only where permitted by law, including where a request is manifestly unfounded or excessive.</p>

      <h2>16. Supervisory Authority</h2>
      <p>You may contact the Lithuanian data protection supervisory authority:</p>
      <p>
        State Data Protection Inspectorate
        <br />
        L. Sapiegos g. 17, LT-10312 Vilnius, Lithuania
        <br />
        Website: vdai.lrv.lt
      </p>
      <p>The Inspectorate may require complaints submitted directly to it to be made in Lithuanian or in another form accepted by the authority.</p>
      <p>We encourage you to contact us first so that we can attempt to resolve the concern, but you are not required to do so before exercising your right to complain.</p>

      <h2>17. Cookies and Similar Technologies</h2>
      <p>UltraSensSkin may use strictly necessary cookies or similar storage technologies for:</p>
      <ul>
        <li>Steam Login;</li>
        <li>authentication and Account sessions;</li>
        <li>checkout continuity;</li>
        <li>security and fraud prevention;</li>
        <li>load balancing;</li>
        <li>storing the selected currency;</li>
        <li>remembering privacy choices; and</li>
        <li>maintaining essential website functionality.</li>
      </ul>
      <p>Strictly necessary technologies are used because the Service cannot operate securely without them.</p>
      <p>At the date of publication, UltraSensSkin does not use:</p>
      <ul>
        <li>third-party advertising cookies;</li>
        <li>behavioural advertising technologies;</li>
        <li>marketing pixels; or</li>
        <li>third-party analytics cookies.</li>
      </ul>
      <p>Further information is provided in the Cookie Policy.</p>
      <p>If non-essential technologies are introduced, they will not be activated before any consent required by applicable law has been obtained.</p>

      <h2>18. Data Security</h2>
      <p>We use reasonable technical and organisational measures designed to protect personal data against:</p>
      <ul>
        <li>unauthorised access;</li>
        <li>accidental or unlawful loss;</li>
        <li>alteration;</li>
        <li>disclosure;</li>
        <li>destruction; and</li>
        <li>misuse.</li>
      </ul>
      <p>Measures may include:</p>
      <ul>
        <li>encrypted transmission;</li>
        <li>access controls;</li>
        <li>authentication controls;</li>
        <li>logging and monitoring;</li>
        <li>separation of payment information;</li>
        <li>data minimisation;</li>
        <li>provider confidentiality obligations;</li>
        <li>backups;</li>
        <li>incident response procedures; and</li>
        <li>periodic security review.</li>
      </ul>
      <p>No internet or electronic storage system can be guaranteed to be completely secure. You are responsible for protecting your Steam Account, email account, devices and authentication credentials.</p>
      <p>If you believe your Account or personal data has been compromised, contact us immediately.</p>

      <h2>19. Personal Data Breaches</h2>
      <p>If a personal data breach occurs, we will investigate and take reasonable containment and remediation measures.</p>
      <p>Where required by applicable law, we will notify:</p>
      <ul>
        <li>the competent supervisory authority; and</li>
        <li>affected individuals where the breach is likely to result in a high risk to their rights and freedoms.</li>
      </ul>
      <p>Notifications may describe the nature of the incident, likely consequences, measures taken and steps users should consider.</p>

      <h2>20. Third-Party Links</h2>
      <p>The Service may contain links to Steam or other third-party websites.</p>
      <p>We are not responsible for the privacy practices of independent third parties. You should review their privacy documentation before providing personal data through their services.</p>
      <p>The presence of a link does not mean that ULTRASENS controls or endorses the third party&rsquo;s data processing.</p>

      <h2>21. Changes to This Privacy Policy</h2>
      <p>We may update this Privacy Policy to reflect:</p>
      <ul>
        <li>changes to the Service;</li>
        <li>new legal requirements;</li>
        <li>changes to Steam or payment functionality;</li>
        <li>security developments;</li>
        <li>new categories of service providers; or</li>
        <li>changes to our processing practices.</li>
      </ul>
      <p>The updated Policy will be published on ultrasensskin.com with a revised effective date.</p>
      <p>Where a change materially affects your rights or the way we use personal data, we will provide additional notice where required.</p>

      <h2>22. Contact</h2>
      <p>Questions, complaints and data protection requests may be sent to:</p>
      <ContactBlock />
    </PolicyLayout>
  );
}
