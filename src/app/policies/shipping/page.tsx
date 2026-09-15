import { PolicyLayout, ContactBlock } from "@/components/layout/PolicyLayout/PolicyLayout";
import { brand } from "@/lib/brand";

export const metadata = { title: "Digital Item Delivery Policy — UltraSensSkin" };

export default function TradeDeliveryPolicyPage() {
  return (
    <PolicyLayout title="Digital Item Delivery Policy" lastUpdated="9 August 2026">
      <p>
        This Digital Item Delivery Policy (&ldquo;Policy&rdquo;) explains how Counter-Strike 2 virtual items
        purchased through ultrasensskin.com are delivered to users through Steam.
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
        This Policy applies to the delivery of Counter-Strike 2 virtual items, commonly referred to as skins
        (&ldquo;Digital Items&rdquo;), purchased through UltraSensSkin.
      </p>
      <p>Digital Items are delivered electronically through Steam. No physical product will be shipped.</p>
      <p>
        ULTRASENS is the contractual seller responsible to you for completing an accepted Order. Delivery may be
        performed on our behalf by a confidential third-party supplier, inventory provider, bot operator or current
        holder of the selected Item (&ldquo;Fulfilment Provider&rdquo;).
      </p>

      <h2>2. Delivery Methods</h2>
      <p>Depending on where the selected Item is held, delivery may be completed:</p>
      <ul>
        <li>through a bot operated by a Fulfilment Provider; or</li>
        <li>directly from the Steam Account currently holding the Item.</li>
      </ul>
      <p>The Steam Account sending the Item may not display the UltraSensSkin name or branding.</p>
      <p>
        The identity and commercial arrangements of Fulfilment Providers are confidential. We may disclose
        relevant information where required by law, necessary to protect your rights, or necessary to investigate a
        particular transfer.
      </p>
      <p>Our use of a Fulfilment Provider does not remove ULTRASENS&rsquo;s responsibility for properly completing an accepted Order.</p>

      <h2>3. Steam Account Requirement</h2>
      <p>You must have a valid Steam Account to receive a Digital Item.</p>
      <p>The Steam Account used for delivery must:</p>
      <ul>
        <li>be connected to your UltraSensSkin Account;</li>
        <li>match the Trade URL provided during checkout or account setup;</li>
        <li>be eligible to receive Trade Offers;</li>
        <li>satisfy applicable Steam Guard requirements;</li>
        <li>not be affected by a restriction preventing the transfer;</li>
        <li>have sufficient inventory capacity; and</li>
        <li>have the profile or inventory visibility reasonably required for delivery.</li>
      </ul>
      <p>We do not deliver an Item to a different Steam Account at the request of another person.</p>
      <p>
        If you want to change your connected Steam Account or Trade URL, the change must be completed and verified
        before placing the relevant Order. A change requested after payment may delay or prevent delivery.
      </p>

      <h2>4. Trade URL</h2>
      <p>
        A valid Steam Trade URL is required so that a Trade Offer can be sent without adding the sending account as
        a Steam friend.
      </p>
      <p>You are responsible for ensuring that:</p>
      <ul>
        <li>the Trade URL is complete and accurate;</li>
        <li>it has not expired or been revoked;</li>
        <li>it belongs to the Steam Account connected to UltraSensSkin; and</li>
        <li>it remains valid until delivery is completed.</li>
      </ul>
      <p>
        If you generate a new Trade URL through Steam, the previous URL may become invalid. You must update the
        Trade URL stored through UltraSensSkin before placing another Order.
      </p>
      <p>A Trade URL should be treated as sensitive account information. You should not publish or share it unnecessarily.</p>

      <h2>5. Delivery Process</h2>
      <p>The standard delivery process is:</p>
      <ul>
        <li>you place an Order and complete payment;</li>
        <li>ULTRASENS issues an Order Confirmation;</li>
        <li>the selected Item is assigned for fulfilment;</li>
        <li>a Trade Offer is created by a bot or the Steam Account holding the Item;</li>
        <li>the Trade Offer is sent to the connected Steam Account;</li>
        <li>you inspect and accept the Trade Offer through Steam; and</li>
        <li>Steam records the Item as transferred to your Steam Account.</li>
      </ul>
      <p>Depending on technical availability, the Service may show Order or delivery statuses such as:</p>
      <ul>
        <li>payment pending;</li>
        <li>Order confirmed;</li>
        <li>preparing delivery;</li>
        <li>Trade Offer sent;</li>
        <li>action required;</li>
        <li>delivered;</li>
        <li>delivery delayed;</li>
        <li>cancelled; or</li>
        <li>refunded.</li>
      </ul>
      <p>
        A status displayed through the Service is informational. Steam&rsquo;s transfer records will be used as the
        primary evidence of whether a Digital Item was transferred.
      </p>

      <h2>6. Delivery Time</h2>
      <p>Following successful payment, a Trade Offer is normally generated or sent within a few minutes.</p>
      <p>
        Unless a different period is clearly disclosed before payment, we aim to complete delivery within 24 hours
        after issuing the Order Confirmation.
      </p>
      <p>The delivery period may be extended where performance is delayed by:</p>
      <ul>
        <li>Steam downtime or technical malfunction;</li>
        <li>a Steam trade restriction, protection period or security hold;</li>
        <li>a fraud or payment security review;</li>
        <li>an invalid or mismatched Trade URL;</li>
        <li>a private profile or inventory where public visibility is technically required;</li>
        <li>insufficient Steam inventory capacity;</li>
        <li>a VAC, community or trade restriction;</li>
        <li>a recent Steam password, device, email or Steam Guard change;</li>
        <li>failure to accept a Trade Offer;</li>
        <li>an expired or rejected Trade Offer;</li>
        <li>a temporary technical problem affecting a Fulfilment Provider;</li>
        <li>a legal or sanctions review; or</li>
        <li>another circumstance outside our reasonable control.</li>
      </ul>
      <p>If delivery cannot be completed within the applicable period, we will investigate and either:</p>
      <ul>
        <li>attempt delivery again;</li>
        <li>ask you to correct an account-related problem;</li>
        <li>allow an appropriate additional delivery period;</li>
        <li>offer an alternative Item with your express agreement; or</li>
        <li>cancel the affected Order and initiate a refund.</li>
      </ul>
      <p>You will not be required to accept a materially different Item.</p>

      <h2>7. Trade Offer Validity</h2>
      <p>A Trade Offer may remain valid only for a limited period determined by Steam or the sending account.</p>
      <p>The applicable validity period may be shown:</p>
      <ul>
        <li>through your UltraSensSkin Account;</li>
        <li>in an Order notification;</li>
        <li>through Steam; or</li>
        <li>directly in the Trade Offer.</li>
      </ul>
      <p>You must review and accept the offer before it expires.</p>
      <p>
        If the Trade Offer expires, the Item is not considered delivered. We may attempt to issue another offer,
        subject to Item availability, Steam functionality and security checks.
      </p>
      <p>
        Repeated expiry or rejection may delay delivery. If delivery remains impossible, the Order may be cancelled
        in accordance with the Refund, Cancellation and Withdrawal Policy.
      </p>

      <h2>8. Inspecting the Trade Offer</h2>
      <p>You must carefully inspect every Trade Offer before accepting it.</p>
      <p>A legitimate delivery offer should:</p>
      <ul>
        <li>be sent to the Steam Account connected to UltraSensSkin;</li>
        <li>contain the Digital Item identified in your Order;</li>
        <li>show the correct item name and relevant characteristics; and</li>
        <li>not require you to provide another Digital Item, money, credentials or authentication information in return.</li>
      </ul>
      <p>UltraSensSkin will never require you to provide through a Steam Trade Offer:</p>
      <ul>
        <li>another skin or virtual item;</li>
        <li>Steam Wallet funds;</li>
        <li>cash or cryptocurrency;</li>
        <li>your Steam password;</li>
        <li>a Steam Guard code;</li>
        <li>an API key;</li>
        <li>an account recovery code; or</li>
        <li>remote access to your device.</li>
      </ul>
      <p>Do not accept an offer if:</p>
      <ul>
        <li>it contains the wrong Item;</li>
        <li>it requests another Item from you;</li>
        <li>the sender claims that an additional payment is required through Steam;</li>
        <li>the offer appears suspicious or altered;</li>
        <li>you received it before placing an Order; or</li>
        <li>you cannot reasonably connect it to your UltraSensSkin Order.</li>
      </ul>
      <p>
        If you are uncertain, do not accept the offer. Contact {brand.contact.email} and provide the Order number
        and relevant screenshots.
      </p>

      <h2>9. Item Characteristics</h2>
      <p>Before accepting a Trade Offer, verify the Item&rsquo;s relevant characteristics, which may include:</p>
      <ul>
        <li>item name and weapon type;</li>
        <li>exterior or wear condition;</li>
        <li>float value;</li>
        <li>pattern or paint seed;</li>
        <li>StatTrak status;</li>
        <li>stickers;</li>
        <li>charms;</li>
        <li>name tags; and</li>
        <li>other characteristics specifically identified in the Order Confirmation.</li>
      </ul>
      <p>Where your Order relates to a specifically identified Item, the Trade Offer must contain that Item.</p>
      <p>If the Trade Offer contains an incorrect or materially different Item, reject the offer and contact us immediately.</p>
      <p>
        Accepting an incorrect Item does not automatically remove mandatory consumer remedies, but prompt rejection
        allows the issue to be resolved more safely.
      </p>

      <h2>10. Multiple Items</h2>
      <p>An Order containing multiple Digital Items may be delivered through:</p>
      <ul>
        <li>one Trade Offer;</li>
        <li>multiple Trade Offers from the same account; or</li>
        <li>separate Trade Offers from different Steam Accounts.</li>
      </ul>
      <p>Delivery of one Item does not necessarily mean that all Items in the Order have been delivered.</p>
      <p>Each Item is considered delivered only when Steam records its transfer to your connected Steam Account.</p>
      <p>If part of an Order cannot be completed, we may:</p>
      <ul>
        <li>continue delivering the remaining Items;</li>
        <li>refund the price allocated to the unavailable Item; or</li>
        <li>cancel the entire Order where the Items cannot reasonably be separated or applicable law requires it.</li>
      </ul>

      <h2>11. Delivery Completion</h2>
      <p>
        Delivery is completed when Steam records the transfer of the correct Digital Item to the Steam Account
        connected to your UltraSensSkin Account.
      </p>
      <p>The following may be used as evidence of delivery:</p>
      <ul>
        <li>Steam Trade Offer ID;</li>
        <li>Steam trade history;</li>
        <li>sending and receiving SteamIDs;</li>
        <li>transaction timestamps;</li>
        <li>Item asset identifiers;</li>
        <li>Order and fulfilment records; and</li>
        <li>confirmation displayed through the Service.</li>
      </ul>
      <p>A Digital Item is not considered undelivered merely because:</p>
      <ul>
        <li>it is temporarily protected from further transfer;</li>
        <li>it is affected by a Steam cooldown;</li>
        <li>it cannot immediately be modified, consumed or re-traded;</li>
        <li>Steam displays a warning relating to trade protection; or</li>
        <li>its value changes after delivery.</li>
      </ul>

      <h2>12. Steam Trade Protection and Cooldowns</h2>
      <p>Steam may impose trade protection periods, cooldowns, holds or other restrictions after a Digital Item is transferred.</p>
      <p>During such a period, the Item may be visible and usable in your Steam Account but may not be:</p>
      <ul>
        <li>transferred again;</li>
        <li>modified;</li>
        <li>consumed;</li>
        <li>used in another Steam-related process; or</li>
        <li>otherwise dealt with in the manner you expected.</li>
      </ul>
      <p>The existence and duration of these restrictions are determined by Steam and may change.</p>
      <p>
        Where a restriction is known before purchase and materially affects delivery or use, we will aim to
        disclose it in the Item information or checkout.
      </p>
      <p>A restriction imposed by Steam after correct delivery does not by itself create a right to a refund. Mandatory consumer rights remain unaffected.</p>

      <h2>13. Steam Account Restrictions</h2>
      <p>Delivery may be prevented by:</p>
      <ul>
        <li>a trade ban;</li>
        <li>a community ban;</li>
        <li>a VAC-related restriction;</li>
        <li>a Steam Guard restriction;</li>
        <li>a recently changed password;</li>
        <li>a recently changed email address;</li>
        <li>transfer of Steam Guard to another device;</li>
        <li>account recovery activity;</li>
        <li>a private inventory;</li>
        <li>a full inventory; or</li>
        <li>another Steam security measure.</li>
      </ul>
      <p>ULTRASENS does not control these restrictions and cannot remove them.</p>
      <p>
        If your Account is restricted, you must follow Steam&rsquo;s instructions to resolve the issue. We may
        pause delivery for a reasonable period while the restriction is addressed.
      </p>
      <p>If the restriction cannot be resolved, the Order will be handled under the Refund, Cancellation and Withdrawal Policy.</p>

      <h2>14. Failure to Receive a Trade Offer</h2>
      <p>If you do not receive a Trade Offer within the expected period:</p>
      <ul>
        <li>confirm that payment and the Order were successfully completed;</li>
        <li>verify that you are signed in to the correct Steam Account;</li>
        <li>check the Trade URL;</li>
        <li>check Steam notifications and trade history;</li>
        <li>confirm that Steam Guard requirements are satisfied;</li>
        <li>check for account or trade restrictions;</li>
        <li>confirm that your inventory has sufficient capacity;</li>
        <li>check the Order status through UltraSensSkin; and</li>
        <li>contact us if the issue continues.</li>
      </ul>
      <p>Do not accept an unrelated offer merely because you are waiting for delivery.</p>
      <p>When contacting support, provide:</p>
      <ul>
        <li>your Order number;</li>
        <li>SteamID;</li>
        <li>approximate payment time;</li>
        <li>the Item purchased;</li>
        <li>the current Order status; and</li>
        <li>screenshots of any relevant Steam message.</li>
      </ul>

      <h2>15. Failed Delivery Caused by the User</h2>
      <p>Delivery may be considered prevented by the user where the user:</p>
      <ul>
        <li>provides an incorrect or third-party Trade URL;</li>
        <li>refuses or repeatedly fails to accept the correct Trade Offer;</li>
        <li>rejects the correct Trade Offer;</li>
        <li>changes the Trade URL after payment;</li>
        <li>makes the Steam profile or inventory inaccessible;</li>
        <li>lacks sufficient inventory capacity;</li>
        <li>causes or fails to resolve an account restriction;</li>
        <li>requests delivery to a different Steam Account;</li>
        <li>blocks the sending account;</li>
        <li>interferes with the delivery process; or</li>
        <li>otherwise fails to satisfy the delivery requirements.</li>
      </ul>
      <p>Where reasonably possible, we will allow you to correct the problem and will attempt delivery again.</p>
      <p>
        If the issue is not corrected within a reasonable period, we may cancel the Order. Any refund will be
        determined under the Refund, Cancellation and Withdrawal Policy and applicable law.
      </p>
      <p>No cancellation or handling fee will be deducted unless it has been clearly disclosed, is legally permitted and is justified by the circumstances.</p>

      <h2>16. Failed Delivery Not Caused by the User</h2>
      <p>If delivery fails because:</p>
      <ul>
        <li>the Item is no longer available;</li>
        <li>the current holder cannot transfer it;</li>
        <li>a Fulfilment Provider cannot complete the transfer;</li>
        <li>an internal technical error affects the Order;</li>
        <li>the wrong Item was assigned;</li>
        <li>the transfer is permanently blocked for reasons not attributable to you; or</li>
        <li>another problem within our responsibility prevents delivery,</li>
      </ul>
      <p>we will provide an appropriate remedy.</p>
      <p>Depending on the circumstances, this may include:</p>
      <ul>
        <li>another delivery attempt;</li>
        <li>delivery of the correct Item;</li>
        <li>an alternative Item with your express agreement;</li>
        <li>cancellation of the affected Item; or</li>
        <li>a full refund of the affected purchase price.</li>
      </ul>
      <p>Our use of a Fulfilment Provider does not permit us to refuse an appropriate remedy solely because the failure originated with that provider.</p>

      <h2>17. Incorrect Delivery</h2>
      <p>If you receive an Item that materially differs from the Order Confirmation, contact us without undue delay.</p>
      <p>Provide:</p>
      <ul>
        <li>the Order number;</li>
        <li>SteamID;</li>
        <li>Trade Offer ID;</li>
        <li>screenshots;</li>
        <li>the Item received; and</li>
        <li>a description of the discrepancy.</li>
      </ul>
      <p>Do not transfer, modify, consume, apply stickers to, rename or otherwise alter the Item while the issue is being investigated.</p>
      <p>Where the Item is confirmed to be incorrect or non-conforming, we may provide:</p>
      <ul>
        <li>delivery of the correct Item;</li>
        <li>replacement with your express agreement;</li>
        <li>an appropriate price reduction;</li>
        <li>cancellation and refund; or</li>
        <li>another remedy required by applicable law.</li>
      </ul>

      <h2>18. Delivery to the Wrong Account</h2>
      <p>
        We deliver only to the Steam Account connected to the UltraSensSkin Account and identified by the Trade URL
        provided for the Order.
      </p>
      <p>ULTRASENS is not responsible for delivery to an unintended Steam Account where:</p>
      <ul>
        <li>you provided the Trade URL for that Account;</li>
        <li>the Trade URL was changed by you;</li>
        <li>another person gained access because you failed to secure your Account; or</li>
        <li>you confirmed delivery despite being shown the receiving Steam Account.</li>
      </ul>
      <p>This limitation does not apply where delivery to the wrong account resulted from an error attributable to ULTRASENS or a Fulfilment Provider acting on our behalf.</p>

      <h2>19. Delivery Security</h2>
      <p>You are responsible for protecting your Steam Account, email account, devices and sessions.</p>
      <p>Before accepting an offer:</p>
      <ul>
        <li>access Steam through an official Steam website or application;</li>
        <li>check the contents of the offer directly in Steam;</li>
        <li>do not rely solely on links received through messages;</li>
        <li>check whether the offer requests anything from you;</li>
        <li>be cautious of copied profiles or impersonation; and</li>
        <li>contact us if the sender or offer appears suspicious.</li>
      </ul>
      <p>UltraSensSkin support will not ask you to disable Steam Guard or other security protections.</p>
      <p>We are not responsible for loss caused by phishing, malware, account sharing or credential disclosure where the loss was not caused by our failure to use legally required care.</p>

      <h2>20. Trade Reversals</h2>
      <p>Steam may permit certain completed trades to be reversed during a protection period.</p>
      <p>If you believe that a completed delivery was incorrect or unauthorised, contact us before initiating a reversal where reasonably possible.</p>
      <p>You must not reverse a correct delivery:</p>
      <ul>
        <li>to obtain both the Item and a refund;</li>
        <li>because the Item&rsquo;s price changed;</li>
        <li>because you changed your mind;</li>
        <li>to avoid payment;</li>
        <li>to transfer loss to another person; or</li>
        <li>for another fraudulent or abusive purpose.</li>
      </ul>
      <p>Improper reversal may result in Account suspension, cancellation of pending Orders, recovery of the Item or its value, and other action permitted by law.</p>
      <p>Nothing in this Section prevents genuine fraud reporting or the exercise of mandatory consumer rights.</p>

      <h2>21. Cancellation During Delivery</h2>
      <p>Once a Trade Offer has been created or sent, fulfilment has begun.</p>
      <p>A cancellation request submitted during this stage is not automatically effective. We will check whether the transfer can safely be stopped.</p>
      <p>If the Trade Offer has not been accepted and the transfer can be cancelled, the request will be handled under the Refund, Cancellation and Withdrawal Policy.</p>
      <p>If the correct Item has already been accepted and delivery has been completed, change-of-mind cancellation will normally no longer be available, subject to statutory rights.</p>

      <h2>22. Unavailability After Payment</h2>
      <p>
        If the selected Item becomes unavailable after payment but before delivery, ULTRASENS will not replace it
        with a materially different Item without your express agreement.
      </p>
      <p>We may offer:</p>
      <ul>
        <li>additional time to resolve a temporary availability issue;</li>
        <li>a clearly identified alternative Item;</li>
        <li>cancellation of the affected Item; or</li>
        <li>a full refund of the affected purchase price.</li>
      </ul>
      <p>You may reject any proposed alternative and request a refund.</p>

      <h2>23. External Service Disruptions</h2>
      <p>Delivery depends on Steam and other external technical systems.</p>
      <p>If a widespread Steam outage or similar external disruption occurs, we may temporarily pause delivery until transfers can be completed safely.</p>
      <p>We will take reasonable steps to:</p>
      <ul>
        <li>monitor the issue;</li>
        <li>protect pending Orders;</li>
        <li>avoid duplicate transfers;</li>
        <li>provide relevant status information; and</li>
        <li>resume delivery when reasonably possible.</li>
      </ul>
      <p>If the disruption continues for an unreasonable period, you may request cancellation and an appropriate refund in accordance with applicable law.</p>

      <h2>24. Support and Delivery Complaints</h2>
      <p>Delivery questions and complaints may be submitted to: {brand.contact.email}</p>
      <p>Please include &ldquo;Delivery Issue&rdquo; and your Order number in the subject line.</p>
      <p>
        We will review consumer complaints free of charge and provide a reasoned written response as soon as
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
      <p>We may update this Policy to reflect changes to Steam functionality, delivery systems, legal requirements or operational processes.</p>
      <p>The current version will be published on ultrasensskin.com with an updated effective date.</p>
      <p>Changes will not retroactively reduce rights relating to an Order already accepted.</p>

      <h2>26. Contact Details</h2>
      <ContactBlock />
    </PolicyLayout>
  );
}
