import { PolicyLayout, ContactBlock } from "@/components/layout/PolicyLayout/PolicyLayout";
import { brand, brandAddressLine } from "@/lib/brand";

export const metadata = { title: "Refund, Cancellation and Withdrawal Policy — UltraSensSkin" };

export default function RefundsPolicyPage() {
  return (
    <PolicyLayout title="Refund, Cancellation and Withdrawal Policy" lastUpdated="9 August 2026">
      <p>
        This Refund, Cancellation and Withdrawal Policy (&ldquo;Policy&rdquo;) explains when an order placed
        through ultrasensskin.com may be cancelled and when a refund, replacement, price reduction or other remedy
        may be available.
      </p>
      <p>This Policy forms part of the UltraSensSkin Terms and Conditions of Purchase and Use.</p>
      <p>The Service is operated by:</p>
      <ContactBlock />
      <p>
        In this Policy, &ldquo;UltraSensSkin&rdquo;, &ldquo;ULTRASENS&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;
        and &ldquo;our&rdquo; refer to {brand.company.legalName}. &ldquo;You&rdquo; and &ldquo;your&rdquo; refer to the
        purchaser.
      </p>

      <h2>1. Scope</h2>
      <p>
        This Policy applies to purchases of Counter-Strike 2 virtual items, commonly referred to as skins
        (&ldquo;Digital Items&rdquo;), made through UltraSensSkin.
      </p>
      <p>
        Each purchase is paid through a separate Visa or Mastercard transaction. UltraSensSkin does not provide a
        stored-value balance or cash withdrawal functionality.
      </p>
      <p>All refunds are subject to:</p>
      <ul>
        <li>this Policy;</li>
        <li>the Terms and Conditions of Purchase and Use;</li>
        <li>applicable consumer law;</li>
        <li>the technical status of the relevant Steam transfer; and</li>
        <li>reasonable fraud and security checks.</li>
      </ul>
      <p>Nothing in this Policy limits any consumer right that cannot lawfully be excluded or restricted.</p>

      <h2>2. General Refund Principles</h2>
      <p>A refund may be available where:</p>
      <ul>
        <li>we cancel an accepted Order;</li>
        <li>the selected Digital Item becomes unavailable before delivery;</li>
        <li>we cannot complete delivery;</li>
        <li>you were charged more than once for the same Order;</li>
        <li>the delivered Item materially differs from the accepted Order;</li>
        <li>the transaction was genuinely unauthorised;</li>
        <li>you validly exercise an applicable statutory withdrawal right; or</li>
        <li>another refund or remedy is required by applicable law.</li>
      </ul>
      <p>A refund will not normally be available solely because:</p>
      <ul>
        <li>you changed your mind after accepting delivery of the correct Item;</li>
        <li>the Item&rsquo;s price or perceived value subsequently changed;</li>
        <li>you no longer want the Item;</li>
        <li>you expected the Item to increase in value;</li>
        <li>the Item is subject to a Steam trade protection period, cooldown or temporary transfer restriction;</li>
        <li>your Steam Account was later restricted, suspended or compromised;</li>
        <li>Steam or Counter-Strike 2 changed its rules, systems or functionality after delivery;</li>
        <li>you transferred, modified, consumed or otherwise disposed of the Item after delivery; or</li>
        <li>
          the Item&rsquo;s appearance differs only because of screen, rendering or game display settings, while
          its recorded characteristics match the Order.
        </li>
      </ul>
      <p>
        These limitations apply only to the extent permitted by law and do not exclude remedies for an incorrect,
        defective or non-conforming supply.
      </p>

      <h2>3. Cancellation Before Order Acceptance</h2>
      <p>You may stop the checkout process at any time before submitting payment.</p>
      <p>
        Submitting an Order constitutes an offer to purchase the selected Digital Item. The purchase contract is
        formed when ULTRASENS issues an Order Confirmation following successful payment authorisation.
      </p>
      <p>
        If you contact us before an Order Confirmation has been issued, we will make reasonable efforts to stop the
        transaction. A temporary card authorisation may still appear and may take time to be released by your card
        issuer.
      </p>

      <h2>4. Cancellation After Order Acceptance but Before Delivery</h2>
      <p>
        Because Digital Item delivery may begin immediately after payment, it may not always be possible to cancel
        an accepted Order before a Trade Offer is created or sent.
      </p>
      <p>You may nevertheless request cancellation by contacting: {brand.contact.email}</p>
      <p>The request must include your Order number and SteamID.</p>
      <p>
        If fulfilment has not begun and the Item has not been committed for transfer, we may cancel the Order and
        issue a full refund.
      </p>
      <p>If fulfilment has already begun, the request will be handled in accordance with:</p>
      <ul>
        <li>any statutory withdrawal right that applies to you;</li>
        <li>any express consent and acknowledgement provided during checkout;</li>
        <li>the current Steam transfer status; and</li>
        <li>applicable law.</li>
      </ul>
      <p>A cancellation request is not confirmed until you receive written confirmation from ULTRASENS.</p>

      <h2>5. Cancellation by ULTRASENS</h2>
      <p>We may cancel an Order before delivery where reasonably necessary because of:</p>
      <ul>
        <li>Digital Item unavailability;</li>
        <li>a supplier or current holder being unable to transfer the Item;</li>
        <li>an obvious pricing, currency or description error;</li>
        <li>payment failure, rejection or reversal;</li>
        <li>suspected fraud or unauthorised card use;</li>
        <li>Steam downtime or restrictions preventing delivery;</li>
        <li>a technical integration error;</li>
        <li>a sanctions, geographic or legal restriction;</li>
        <li>violation of the Terms and Conditions of Purchase and Use; or</li>
        <li>another circumstance that makes lawful delivery impossible.</li>
      </ul>
      <p>
        If we cancel an accepted and paid Order for a reason not caused by you, we will initiate a full refund to
        the original payment method.
      </p>
      <p>We will not substitute another materially different Digital Item without your express agreement.</p>

      <h2>6. Item Unavailability</h2>
      <p>
        Digital Item availability can change rapidly. An Item may become unavailable because it has already been
        transferred, withdrawn, locked, restricted or removed from the Steam Account holding it.
      </p>
      <p>If the selected Item becomes unavailable before delivery, we may offer you:</p>
      <ul>
        <li>additional time while we attempt to complete delivery;</li>
        <li>an alternative Item, but only with your express agreement; or</li>
        <li>cancellation and a full refund.</li>
      </ul>
      <p>You are not required to accept an alternative Item or store credit.</p>

      <h2>7. Delivery Failure</h2>
      <p>
        Delivery is normally completed within a few minutes after successful payment. Unless a different period
        was disclosed before payment, we aim to complete delivery within 24 hours after the Order Confirmation.
      </p>
      <p>If delivery cannot be completed within the applicable period for reasons not caused by you, we will:</p>
      <ul>
        <li>investigate the transfer status;</li>
        <li>attempt delivery again where reasonably possible;</li>
        <li>allow an appropriate additional period where the issue is temporary; or</li>
        <li>cancel the affected Order and initiate a full refund.</li>
      </ul>
      <p>
        You may request cancellation if delivery has not been completed within the agreed period or an appropriate
        additional period, subject to applicable law.
      </p>
      <p>
        A temporary delay caused by Steam, a security review or another external technical problem does not
        automatically entitle either party to treat the Order as permanently failed. However, we will not require
        you to wait indefinitely.
      </p>

      <h2>8. Delivery Problems Caused by Account Settings</h2>
      <p>Delivery may fail or be delayed where:</p>
      <ul>
        <li>the Trade URL is invalid, expired or belongs to another Steam Account;</li>
        <li>the Steam profile or inventory is private where public access is technically required;</li>
        <li>the Steam inventory is full;</li>
        <li>the Steam Account is affected by a VAC, community or trade restriction;</li>
        <li>Steam Guard or another Steam security requirement has not been satisfied;</li>
        <li>a password, device or security setting was recently changed;</li>
        <li>the Trade Offer was not accepted within its validity period; or</li>
        <li>another user-controlled issue prevents transfer.</li>
      </ul>
      <p>Where possible, we will notify you and allow a reasonable opportunity to correct the issue.</p>
      <p>
        After the issue is corrected, we may send a replacement Trade Offer. The replacement offer remains subject
        to availability and Steam functionality.
      </p>
      <p>
        If delivery remains impossible because you do not correct the issue within a reasonable period, we may
        cancel the Order. Any refund will be assessed in accordance with applicable law and the circumstances of
        the Order.
      </p>
      <p>
        We will not impose an undisclosed cancellation fee. Any lawful deduction must be clearly explained and
        supported by the actual circumstances of the transaction.
      </p>

      <h2>9. Expired or Rejected Trade Offers</h2>
      <p>A Trade Offer may remain valid only for the period displayed through the Service or Steam.</p>
      <p>If a Trade Offer expires or is rejected:</p>
      <ul>
        <li>the Item may remain available for another delivery attempt;</li>
        <li>you may be required to request or wait for a new Trade Offer;</li>
        <li>delivery may be delayed; and</li>
        <li>you must not accept any later offer without verifying its contents.</li>
      </ul>
      <p>Rejection or expiry does not automatically cancel the Order.</p>
      <p>
        If we cannot safely issue another offer, we will either provide another appropriate solution or cancel and
        refund the affected Order.
      </p>

      <h2>10. Completion of Delivery</h2>
      <p>
        Delivery is completed when Steam records the transfer of the correct Digital Item to the Steam Account
        connected to your UltraSensSkin Account.
      </p>
      <p>Once you accept the correct Item:</p>
      <ul>
        <li>the transaction is normally treated as completed;</li>
        <li>a change-of-mind refund will generally no longer be available;</li>
        <li>the Item may become subject to Steam trade protection or another temporary restriction; and</li>
        <li>you remain responsible for protecting the Steam Account holding the Item.</li>
      </ul>
      <p>
        A Steam protection period or cooldown does not mean that delivery failed if the correct Item is present in
        your Steam Account.
      </p>

      <h2>11. Incorrect or Non-Conforming Items</h2>
      <p>You must carefully review the Trade Offer before accepting it.</p>
      <p>
        If the Trade Offer contains an Item that does not match your Order, do not accept the offer. Contact us
        immediately and provide:
      </p>
      <ul>
        <li>your Order number;</li>
        <li>SteamID;</li>
        <li>Trade Offer ID or link;</li>
        <li>screenshots of the offer; and</li>
        <li>a description of the discrepancy.</li>
      </ul>
      <p>
        If you accepted an Item and later discover that it materially differs from the Order Confirmation, contact
        us without undue delay.
      </p>
      <p>A material discrepancy may include:</p>
      <ul>
        <li>a different item name or type;</li>
        <li>a different exterior or wear category;</li>
        <li>a materially different float value where a specific value was part of the Order;</li>
        <li>a different pattern or paint seed where specifically identified;</li>
        <li>missing StatTrak status;</li>
        <li>missing stickers, charms or other specifically listed characteristics; or</li>
        <li>delivery to the wrong Steam Account due to an error attributable to us.</li>
      </ul>
      <p>Depending on the circumstances and applicable law, we may provide:</p>
      <ul>
        <li>delivery of the correct Item;</li>
        <li>replacement with your express agreement;</li>
        <li>an appropriate price reduction;</li>
        <li>cancellation and refund; or</li>
        <li>another mandatory legal remedy.</li>
      </ul>
      <p>
        A minor difference in colour or appearance caused solely by screen settings, rendering, lighting or a game
        update is not a material discrepancy where the recorded Item characteristics match the Order.
      </p>

      <h2>12. Duplicate Payments</h2>
      <p>If you are charged more than once for the same Order, contact us with:</p>
      <ul>
        <li>the Order number;</li>
        <li>payment dates;</li>
        <li>amounts and currencies;</li>
        <li>card transaction references, where available; and</li>
        <li>evidence showing the duplicate charges.</li>
      </ul>
      <p>
        We will investigate the payment records. Any confirmed duplicate amount will be refunded to the applicable
        original payment method.
      </p>
      <p>
        Separate charges for separate Orders are not duplicate payments merely because the Orders contain similar
        Items or were placed close together.
      </p>

      <h2>13. Unauthorised Transactions</h2>
      <p>If you believe a payment was made without your authorisation:</p>
      <ul>
        <li>contact your card issuer promptly;</li>
        <li>secure your Steam Account, email and devices;</li>
        <li>notify us at {brand.contact.email}; and</li>
        <li>provide the Order details and relevant evidence.</li>
      </ul>
      <p>We may suspend the associated Account and delivery while the matter is investigated.</p>
      <p>
        A refund or reversal will depend on the payment status, whether delivery occurred, the results of the
        investigation, card network rules and applicable law.
      </p>
      <p>
        We may provide relevant transaction information to the payment service provider, card issuer or competent
        authorities where lawfully requested.
      </p>

      <h2>14. Statutory Right of Withdrawal</h2>
      <p>
        Consumers in the European Union, European Economic Area and certain other jurisdictions may have a
        statutory right to withdraw from a distance contract within 14 days without providing a reason.
      </p>
      <p>Where this right applies, the withdrawal period normally begins on the date the purchase contract is concluded.</p>
      <p>However, special rules may apply to digital content or services supplied immediately.</p>
      <p>Before beginning immediate performance during the withdrawal period, UltraSensSkin may ask you to:</p>
      <ul>
        <li>expressly request or consent to performance beginning before the withdrawal period expires; and</li>
        <li>
          acknowledge that, once performance begins or is completed, you may lose your statutory right to withdraw
          to the extent permitted by law.
        </li>
      </ul>
      <p>
        The relevant consent and acknowledgement must be provided separately during checkout. A pre-selected
        checkbox or general acceptance of the Terms alone does not constitute the required consent.
      </p>
      <p>
        Where all applicable legal requirements have been met and the correct Digital Item has been delivered and
        accepted, the statutory change-of-mind withdrawal right may no longer be available.
      </p>
      <p>
        Where the required consent, acknowledgement or confirmation was not properly obtained, your statutory
        withdrawal rights remain unaffected.
      </p>

      <h2>15. Exercising a Withdrawal Right</h2>
      <p>
        If you have an applicable withdrawal right and it has not lawfully expired, you may exercise it by sending
        a clear statement to:
      </p>
      <ContactBlock />
      <p>Your statement should identify:</p>
      <ul>
        <li>your name;</li>
        <li>SteamID;</li>
        <li>Order number;</li>
        <li>Order date;</li>
        <li>the Digital Item concerned; and</li>
        <li>your decision to withdraw from the contract.</li>
      </ul>
      <p>You may use the model withdrawal form at the end of this Policy, but its use is not mandatory.</p>
      <p>The withdrawal notice must be sent before the applicable withdrawal period expires.</p>

      <h2>16. Effect of a Valid Withdrawal</h2>
      <p>Where you validly exercise a statutory withdrawal right:</p>
      <ul>
        <li>we will confirm receipt of your request;</li>
        <li>we will review whether delivery or performance has already begun;</li>
        <li>you must not transfer, modify, consume or dispose of the Item while the request is being considered;</li>
        <li>you must cooperate with any lawful and technically available return or reversal process; and</li>
        <li>we will process the refund required by applicable law.</li>
      </ul>
      <p>No refund will be completed twice for the same transaction.</p>
      <p>
        If a Digital Item has already been returned through Steam, reversed or otherwise recovered, we may verify
        the return before completing the refund.
      </p>
      <p>
        Where applicable law permits a proportionate charge for performance supplied before withdrawal, any charge
        will be calculated and explained in accordance with that law. We will not impose a charge where the legal
        conditions for doing so have not been satisfied.
      </p>

      <h2>17. Steam Trade Reversals</h2>
      <p>
        Do not use Steam&rsquo;s trade reversal functionality as a substitute for contacting UltraSensSkin about a
        refund, except where immediate action is reasonably necessary to protect a compromised account or exercise
        a legal right.
      </p>
      <p>Improper reversal of a completed trade may result in:</p>
      <ul>
        <li>suspension or termination of the UltraSensSkin Account;</li>
        <li>cancellation of pending Orders;</li>
        <li>recovery of the Item or its value;</li>
        <li>contesting an associated payment dispute; and</li>
        <li>recovery of reasonably incurred losses where permitted by law.</li>
      </ul>
      <p>
        If a trade is reversed and you also receive a card refund, you must promptly notify us. You are not
        entitled to retain both the Digital Item and the refunded purchase price.
      </p>
      <p>Nothing in this Section restricts genuine fraud reporting or mandatory consumer rights.</p>

      <h2>18. Chargebacks and Payment Disputes</h2>
      <p>You have the right to raise a genuine dispute with your card issuer.</p>
      <p>
        Where reasonably possible, we encourage you to contact us first so that we can investigate and attempt to
        resolve the problem promptly. This does not require you to give up any cardholder or consumer right.
      </p>
      <p>You must not initiate a chargeback:</p>
      <ul>
        <li>after receiving and retaining the correct Item;</li>
        <li>because the Item&rsquo;s value changed;</li>
        <li>because of a Steam restriction imposed after correct delivery;</li>
        <li>as a means of obtaining both the Item and the purchase price; or</li>
        <li>using false or misleading information.</li>
      </ul>
      <p>
        We may submit the Order Confirmation, Steam transfer record, Trade Offer information, communications and
        other relevant evidence in response to a payment dispute.
      </p>
      <p>Fraudulent or abusive chargebacks may result in Account termination and recovery action.</p>

      <h2>19. Refund Method</h2>
      <p>Refunds are normally issued to the original payment method used for the Order.</p>
      <p>We do not normally provide refunds:</p>
      <ul>
        <li>to another card;</li>
        <li>by bank transfer where payment was made by card;</li>
        <li>in cash;</li>
        <li>as cryptocurrency; or</li>
        <li>to another person.</li>
      </ul>
      <p>
        If the original payment method is no longer available, the refund method will be determined in
        consultation with the payment service provider and in accordance with applicable law.
      </p>
      <p>
        We will not require you to accept store credit instead of a monetary refund where you are legally entitled
        to receive money.
      </p>

      <h2>20. Refund Currency</h2>
      <p>Refunds are processed in the currency used for the original Order:</p>
      <ul>
        <li>EUR;</li>
        <li>USD; or</li>
        <li>GBP.</li>
      </ul>
      <p>We refund the amount lawfully due in the transaction currency.</p>
      <p>
        Your card issuer may convert the refund into another currency using a different exchange rate from the
        original payment. ULTRASENS does not control card issuer exchange rates or external conversion fees and is
        not responsible for differences caused solely by those rates or fees.
      </p>

      <h2>21. Refund Timing</h2>
      <p>Once a refund is approved, ULTRASENS will initiate it without undue delay.</p>
      <p>
        Where a statutory withdrawal or consumer remedy applies, the refund will be initiated within the legally
        required period, including within 14 calendar days where that deadline applies.
      </p>
      <p>
        After initiation, card issuers and payment service providers may require additional processing time.
        Refunds commonly appear within 5&ndash;10 business days, but the exact period depends on the relevant
        financial institution and is outside our direct control.
      </p>
      <p>A refund may be delayed where reasonably necessary because of:</p>
      <ul>
        <li>an unresolved payment dispute;</li>
        <li>suspected fraud or unauthorised activity;</li>
        <li>a sanctions or legal restriction;</li>
        <li>missing information required to identify the transaction;</li>
        <li>an unresolved Steam trade or reversal;</li>
        <li>a technical payment provider issue; or</li>
        <li>a lawful authority request.</li>
      </ul>
      <p>We will not delay a refund for longer than reasonably necessary or beyond any mandatory legal deadline.</p>

      <h2>22. Partial Orders</h2>
      <p>If an Order contains multiple Digital Items and only part of the Order cannot be completed, we may:</p>
      <ul>
        <li>deliver the available Items and refund the price of the unavailable Items; or</li>
        <li>
          cancel the entire Order where the Items cannot reasonably be separated or applicable law requires full
          cancellation.
        </li>
      </ul>
      <p>Any partial refund will be calculated using the price allocated to the affected Item in the Order Confirmation.</p>

      <h2>23. Evidence and Investigation</h2>
      <p>To investigate a refund request, we may reasonably request:</p>
      <ul>
        <li>Order and transaction references;</li>
        <li>SteamID;</li>
        <li>Trade URL confirmation;</li>
        <li>Trade Offer records;</li>
        <li>screenshots;</li>
        <li>Steam inventory history;</li>
        <li>payment evidence;</li>
        <li>correspondence; or</li>
        <li>information needed to confirm account ownership or payment authorisation.</li>
      </ul>
      <p>Requests will be limited to information reasonably necessary for the investigation, fraud prevention or legal compliance.</p>
      <p>
        Failure to provide relevant information may prevent or delay resolution, but it does not remove any
        mandatory right that can be established through other evidence.
      </p>

      <h2>24. Complaints</h2>
      <p>Refund-related complaints may be sent to: {brand.contact.email}</p>
      <p>Please include &ldquo;Refund Complaint&rdquo; and the Order number in the subject line.</p>
      <p>
        We will consider consumer complaints free of charge and provide a reasoned written response as soon as
        reasonably possible and no later than 14 days after receipt where required by Lithuanian law.
      </p>
      <p>If a consumer dispute cannot be resolved directly, an eligible consumer may contact:</p>
      <p>
        State Consumer Rights Protection Authority
        <br />
        A. Goštauto g. 12, LT-01108 Vilnius, Lithuania
        <br />
        Website: vvtat.lrv.lt
      </p>

      <h2>25. Policy Changes</h2>
      <p>We may update this Policy to reflect legal, payment, Steam, delivery or operational changes.</p>
      <p>The current version will be published on ultrasensskin.com with an updated effective date.</p>
      <p>
        A change will not retroactively reduce rights relating to an Order already accepted. The version in effect
        when the Order was placed will apply, together with any mandatory law.
      </p>

      <h2>26. Contact</h2>
      <p>Questions or requests concerning cancellations, refunds or withdrawal rights may be sent to:</p>
      <ContactBlock />

      <h2>Model Withdrawal Form</h2>
      <p>
        Complete and return this form only if you have an applicable right to withdraw from the contract and wish
        to exercise that right.
      </p>
      <p>
        To: {brand.company.legalName}, {brandAddressLine}. Email: {brand.contact.email}
      </p>
      <p>I hereby give notice that I withdraw from my contract for the purchase of the following Digital Item:</p>
      <ul>
        <li>Digital Item: [Insert item]</li>
        <li>Order number: [Insert order number]</li>
        <li>Order date: [Insert date]</li>
        <li>SteamID: [Insert SteamID]</li>
        <li>Consumer&rsquo;s name: [Insert name]</li>
        <li>Consumer&rsquo;s address: [Insert address]</li>
        <li>Date: [Insert date]</li>
        <li>Signature: [Required only if this form is submitted on paper]</li>
      </ul>
    </PolicyLayout>
  );
}
