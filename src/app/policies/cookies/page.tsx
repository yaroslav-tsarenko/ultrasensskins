import { PolicyLayout, ContactBlock } from "@/components/layout/PolicyLayout/PolicyLayout";

export const metadata = { title: "Cookie Policy — UltraSensSkin" };

export default function CookiePolicyPage() {
  return (
    <PolicyLayout title="Cookie Policy" lastUpdated="9 August 2026">
      <p>
        This Cookie Policy explains how ULTRASENS LT, MB uses cookies and similar technologies through
        ultrasensskin.com.
      </p>
      <p>
        This Policy should be read together with the UltraSensSkin Privacy Policy and Terms and Conditions of
        Purchase and Use.
      </p>
      <p>The Service is operated by:</p>
      <ContactBlock />
      <p>
        In this Policy, &ldquo;UltraSensSkin&rdquo;, &ldquo;ULTRASENS&rdquo;, &ldquo;we&rdquo;,
        &ldquo;us&rdquo; and &ldquo;our&rdquo; refer to ULTRASENS LT, MB. &ldquo;You&rdquo; and
        &ldquo;your&rdquo; refer to the individual using the Service.
      </p>

      <h2>1. What Are Cookies?</h2>
      <p>
        Cookies are small text files stored on a computer, smartphone or other device when a website is
        accessed.
      </p>
      <p>Cookies can help a website:</p>
      <ul>
        <li>recognise a browser or session;</li>
        <li>keep a user signed in;</li>
        <li>maintain checkout information;</li>
        <li>remember settings;</li>
        <li>protect accounts and transactions;</li>
        <li>prevent fraud; and</li>
        <li>provide other necessary functionality.</li>
      </ul>
      <p>
        Some cookies are deleted when the browser is closed. These are commonly called session cookies. Other
        cookies may remain for a limited period or until they are deleted.
      </p>

      <h2>2. Similar Technologies</h2>
      <p>The Service may also use technologies that perform functions similar to cookies, including:</p>
      <ul>
        <li>local storage;</li>
        <li>session storage;</li>
        <li>security tokens;</li>
        <li>authentication identifiers;</li>
        <li>device or browser storage;</li>
        <li>server-side session records; and</li>
        <li>similar technical mechanisms.</li>
      </ul>
      <p>
        References to &ldquo;cookies&rdquo; in this Policy include these similar technologies where
        appropriate.
      </p>

      <h2>3. Cookies Currently Used</h2>
      <p>
        At the date of publication, UltraSensSkin uses or may use only cookies and similar technologies that
        are strictly necessary to operate, secure and deliver the Service.
      </p>
      <p>UltraSensSkin does not currently use:</p>
      <ul>
        <li>third-party analytics cookies;</li>
        <li>advertising cookies;</li>
        <li>behavioural advertising tools;</li>
        <li>cross-site tracking technologies;</li>
        <li>marketing pixels; or</li>
        <li>social media advertising cookies.</li>
      </ul>

      <h2>4. Strictly Necessary Cookies</h2>
      <p>
        Strictly necessary cookies support functions without which the Service cannot operate securely or as
        requested.
      </p>
      <p>They may be used for the following purposes.</p>

      <h3>4.1 Authentication and Steam Login</h3>
      <p>These technologies may:</p>
      <ul>
        <li>maintain the login session;</li>
        <li>securely connect the login request with the response received from Steam;</li>
        <li>prevent login request forgery;</li>
        <li>recognise the authenticated Account;</li>
        <li>maintain session continuity; and</li>
        <li>sign the user out when the session expires.</li>
      </ul>
      <p>Steam Login does not give UltraSensSkin access to your Steam password.</p>

      <h3>4.2 Account Security</h3>
      <p>Security cookies or tokens may:</p>
      <ul>
        <li>prevent unauthorised access;</li>
        <li>detect suspicious sessions;</li>
        <li>protect against cross-site request forgery;</li>
        <li>prevent repeated malicious requests;</li>
        <li>apply rate limits;</li>
        <li>verify that a request originates from an authorised session; and</li>
        <li>support fraud prevention.</li>
      </ul>

      <h3>4.3 Checkout and Order Continuity</h3>
      <p>These technologies may:</p>
      <ul>
        <li>retain selected Items during checkout;</li>
        <li>connect the checkout to the correct Account;</li>
        <li>remember the selected currency;</li>
        <li>maintain Order status;</li>
        <li>prevent duplicate submission;</li>
        <li>connect payment status with the correct Order; and</li>
        <li>support the return from a payment authentication process.</li>
      </ul>

      <h3>4.4 Delivery Functionality</h3>
      <p>Necessary storage may be used to:</p>
      <ul>
        <li>connect an Order with the correct Steam Account;</li>
        <li>display the current delivery status;</li>
        <li>maintain Trade Offer information;</li>
        <li>prevent duplicate delivery requests; and</li>
        <li>preserve delivery-related security information.</li>
      </ul>

      <h3>4.5 Currency and Essential Preferences</h3>
      <p>The Service may remember whether you selected:</p>
      <ul>
        <li>EUR;</li>
        <li>USD; or</li>
        <li>GBP.</li>
      </ul>
      <p>
        It may also remember essential language, privacy or session settings so that the Service can be
        displayed and operated consistently.
      </p>

      <h3>4.6 Privacy Choices</h3>
      <p>
        Where a privacy notice or settings interface is displayed, a cookie may remember that you have viewed
        the notice or made a privacy choice.
      </p>
      <p>This prevents the same notice from being shown unnecessarily on every page.</p>

      <h3>4.7 Infrastructure and Service Protection</h3>
      <p>
        Hosting, security or infrastructure providers may use strictly necessary technologies to:
      </p>
      <ul>
        <li>distribute website traffic;</li>
        <li>maintain availability;</li>
        <li>prevent denial-of-service attacks;</li>
        <li>detect malicious requests;</li>
        <li>maintain secure connections; and</li>
        <li>protect the Service against automated abuse.</li>
      </ul>

      <h2>5. Current Cookie Categories</h2>
      <table>
        <thead>
          <tr>
            <th>Category</th>
            <th>Purpose</th>
            <th>Typical duration</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Authentication</td>
            <td>Steam Login, Account access and session continuity</td>
            <td>Session or until logout; a limited persistent period may apply if login continuity is enabled</td>
          </tr>
          <tr>
            <td>Security</td>
            <td>Fraud prevention, request validation and protection against abuse</td>
            <td>Session or a limited security period</td>
          </tr>
          <tr>
            <td>Checkout</td>
            <td>Cart, payment flow and Order continuity</td>
            <td>Normally until checkout or the related session is completed</td>
          </tr>
          <tr>
            <td>Delivery</td>
            <td>Displaying and securing Order and Trade Offer status</td>
            <td>Until delivery is completed or the session expires</td>
          </tr>
          <tr>
            <td>Currency and preferences</td>
            <td>Remembering EUR, USD, GBP and essential settings</td>
            <td>Until changed, deleted or expired</td>
          </tr>
          <tr>
            <td>Privacy settings</td>
            <td>Remembering that a notice was viewed or a choice was made</td>
            <td>A limited period so that the choice does not need to be repeated unnecessarily</td>
          </tr>
          <tr>
            <td>Infrastructure</td>
            <td>Availability, load distribution and attack prevention</td>
            <td>Session or a limited period determined by the security requirement</td>
          </tr>
        </tbody>
      </table>
      <p>
        The exact lifetime of a cookie may vary depending on browser settings, security requirements and
        technical implementation.
      </p>
      <p>No cookie will be retained longer than reasonably necessary for its stated purpose.</p>

      <h2>6. Legal Basis</h2>
      <p>Strictly necessary cookies are used because they are required to:</p>
      <ul>
        <li>provide a Service expressly requested by the user;</li>
        <li>authenticate the Account;</li>
        <li>maintain a secure session;</li>
        <li>process an Order;</li>
        <li>support payment and delivery;</li>
        <li>prevent fraud; or</li>
        <li>comply with legal and security requirements.</li>
      </ul>
      <p>
        Where personal data is processed through these technologies, the applicable GDPR legal basis may
        include:
      </p>
      <ul>
        <li>performance of a contract under Article 6(1)(b);</li>
        <li>compliance with a legal obligation under Article 6(1)(c); or</li>
        <li>
          legitimate interests under Article 6(1)(f), including Service security, fraud prevention and
          protection of users.
        </li>
      </ul>
      <p>
        Consent is not requested for a cookie that is strictly necessary for a function expressly requested
        by the user where applicable law permits it.
      </p>

      <h2>7. Steam Cookies</h2>
      <p>
        When you select Steam Login, you may be redirected to or interact with a Steam-controlled website.
      </p>
      <p>Steam may set or access its own cookies to:</p>
      <ul>
        <li>authenticate the Steam Account;</li>
        <li>maintain the Steam session;</li>
        <li>apply Steam security controls; and</li>
        <li>return the authentication result.</li>
      </ul>
      <p>
        Steam controls its own cookies and processes related information under its own privacy documentation.
        UltraSensSkin does not control cookies placed directly by Steam.
      </p>
      <p>You may be unable to use Steam Login if cookies required by Steam are blocked.</p>

      <h2>8. Payment Cookies</h2>
      <p>
        During checkout, an authorised payment service provider may use strictly necessary cookies or similar
        technologies to:
      </p>
      <ul>
        <li>process the card payment;</li>
        <li>prevent fraud;</li>
        <li>perform card authentication;</li>
        <li>support 3-D Secure or another authentication process;</li>
        <li>maintain the payment session; and</li>
        <li>return the transaction status to UltraSensSkin.</li>
      </ul>
      <p>
        The payment service provider may process these technologies under its own privacy documentation and
        regulatory responsibilities.
      </p>
      <p>UltraSensSkin does not use payment cookies for advertising.</p>

      <h2>9. Fulfilment Providers</h2>
      <p>
        Digital Item supply and fulfilment providers do not receive permission through this Policy to place
        advertising or analytics cookies on your device.
      </p>
      <p>
        Information required to complete a Steam transfer may be exchanged through secure server-to-server
        communications rather than browser cookies.
      </p>

      <h2>10. Managing Cookies</h2>
      <p>Most browsers allow you to:</p>
      <ul>
        <li>view stored cookies;</li>
        <li>delete cookies;</li>
        <li>block all cookies;</li>
        <li>block cookies from selected websites;</li>
        <li>delete cookies when the browser is closed; or</li>
        <li>receive a warning before a cookie is stored.</li>
      </ul>
      <p>The relevant controls are normally available in the browser&rsquo;s privacy or security settings.</p>
      <p>Deleting or blocking strictly necessary cookies may cause:</p>
      <ul>
        <li>Steam Login to fail;</li>
        <li>the Account session to end;</li>
        <li>the cart or checkout to reset;</li>
        <li>payment authentication to fail;</li>
        <li>Order status to display incorrectly;</li>
        <li>delivery features to become unavailable; or</li>
        <li>security protections to stop working correctly.</li>
      </ul>
      <p>
        UltraSensSkin is not responsible for Service failures caused solely by a user blocking technologies
        required to provide a requested function.
      </p>

      <h2>11. Cookie Consent</h2>
      <p>
        UltraSensSkin does not currently use non-essential analytics, advertising or marketing cookies.
      </p>
      <p>
        Accordingly, the Service does not request consent for such technologies at the date of publication.
      </p>
      <p>If non-essential cookies are introduced in the future:</p>
      <ul>
        <li>they will be clearly identified;</li>
        <li>they will not be activated before any legally required consent is obtained;</li>
        <li>consent options will not be pre-selected;</li>
        <li>rejecting them will be as accessible as accepting them;</li>
        <li>users will be able to change or withdraw consent; and</li>
        <li>withdrawal will not affect the lawfulness of processing performed before withdrawal.</li>
      </ul>
      <p>
        The Cookie Policy and any cookie settings interface will be updated before or when such technologies
        are introduced.
      </p>

      <h2>12. Do Not Track and Browser Signals</h2>
      <p>Some browsers transmit &ldquo;Do Not Track&rdquo; or similar privacy signals.</p>
      <p>
        Because UltraSensSkin does not currently use behavioural advertising or cross-site tracking, such
        signals do not change advertising behaviour through the Service.
      </p>
      <p>
        Where applicable law requires recognition of a particular browser-based privacy signal, we will take
        reasonable steps to honour it.
      </p>

      <h2>13. Data Collected Through Necessary Technologies</h2>
      <p>Strictly necessary cookies and related systems may process:</p>
      <ul>
        <li>session identifier;</li>
        <li>Account identifier;</li>
        <li>SteamID;</li>
        <li>IP address;</li>
        <li>browser and device information;</li>
        <li>login and request timestamps;</li>
        <li>selected currency;</li>
        <li>checkout and Order identifiers;</li>
        <li>authentication status;</li>
        <li>security events; and</li>
        <li>delivery status.</li>
      </ul>
      <p>
        Further information about the purposes, recipients, retention criteria and your rights is provided in
        the Privacy Policy.
      </p>

      <h2>14. Retention</h2>
      <p>Cookie retention depends on the function performed.</p>
      <p>Session cookies are normally removed when:</p>
      <ul>
        <li>you sign out;</li>
        <li>the session expires; or</li>
        <li>the browser is closed.</li>
      </ul>
      <p>Persistent cookies are removed or expire when:</p>
      <ul>
        <li>the relevant preference is changed;</li>
        <li>the stated technical period expires;</li>
        <li>the cookie is no longer required; or</li>
        <li>you delete it through your browser.</li>
      </ul>
      <p>
        Related server-side records may be retained for a different period where necessary for security,
        accounting, fraud prevention, Order performance or legal claims, as described in the Privacy Policy.
      </p>

      <h2>15. Policy Changes</h2>
      <p>We may update this Cookie Policy to reflect:</p>
      <ul>
        <li>technical changes;</li>
        <li>new Service features;</li>
        <li>changes to Steam Login;</li>
        <li>changes to payment functionality;</li>
        <li>legal requirements; or</li>
        <li>changes to the cookies or similar technologies used.</li>
      </ul>
      <p>The current version will be published on ultrasensskin.com with a revised effective date.</p>
      <p>
        If a future change introduces non-essential cookies, any legally required consent will be obtained
        before those cookies are activated.
      </p>

      <h2>16. Contact</h2>
      <p>Questions about cookies or similar technologies may be sent to:</p>
      <ContactBlock />
    </PolicyLayout>
  );
}
