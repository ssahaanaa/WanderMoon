function Privacy() {
  return (
    <section className="legal">
      <h1>Privacy Policy</h1>
      <p>WanderMoon is a demo travel booking app built for a college lab. No real trips are sold.</p>

      <h2>What you enter</h2>
      <p>
        When you sign up or book, you type a name, email, phone number and password, and traveler
        details. Payments are simulated, so never enter real card details.
      </p>

      <h2>Where it is stored</h2>
      <p>
        The app has no real server. The demo API runs inside your browser, so what you enter is not
        sent to us or to anyone else. Your login token is kept in session storage and is erased when
        you close the tab. Package results are cached in local storage for a few minutes. Bookings and
        accounts disappear when you refresh the page.
      </p>

      <h2>Other websites</h2>
      <p>
        Fonts load from Google Fonts. That site can see your IP
        address when your browser asks them for files.
      </p>

      <h2>What we do not do</h2>
      <p>No cookies, no analytics, no ads and no selling of data.</p>
    </section>
  );
}

export default Privacy;
