import React from "react";
import "../styles/HomePage.css";
import Image from "../images/clinic.jpg";
import dentist from "../images/dentist.jpg";
import patient from "../images/patient-care.jpg";

const HomePage = () => {
    return (
        <div className="home-page">
            <header className="home-header">
                <h1>Welcome to Our Dental Clinic</h1>
                <p>Providing quality care for your oral health.</p>
            </header>

            <div className="home-content">
    <div className="home-section">
        <img
            src={Image}
            alt="Our Clinic"
            className="home-image"
        />
        <div className="home-text">
            <h2>About Our Clinic</h2>
            <p>
                Our dental clinic has been serving the community for over 10 years,
                providing top-notch services in a comfortable and welcoming
                environment. We specialize in a wide range of treatments to ensure
                your oral health is in great hands.
            </p>
        </div>
    </div>

    <div className="home-section reverse">
        <img
            src={dentist}
            alt="Our Team"
            className="home-image"
        />
        <div className="home-text">
            <h2>Meet Our Team</h2>
            <p>
                Our team of highly qualified and experienced dentists are here to
                make your visit pleasant and stress-free. From routine checkups to
                complex treatments, we are dedicated to your smile.
            </p>
        </div>
    </div>

    <div className="home-section">
        <img
            src={patient}
            alt="Why Choose Us"
            className="home-image"
        />
        <div className="home-text">
            <h2>Why Choose Us?</h2>
            <ul>
                <li>State-of-the-art technology</li>
                <li>Friendly and professional staff</li>
                <li>Affordable pricing and flexible payment plans</li>
                <li>Comprehensive range of dental services</li>
            </ul>
        </div>
    </div>
</div>

        </div>
    );
};

export default HomePage;
