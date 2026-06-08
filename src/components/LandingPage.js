import React from "react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      {/* Header / Hero Section */}
      <header className="bg-primary text-white text-center py-5 px-3">
        <div className="container">
          <h1 className="display-4 fw-bold">Welcome to TestMaster</h1>
          <p className="lead">Master your skills with personalized tests and resources</p>
          <button className="btn btn-light btn-lg mt-3" onClick={() => navigate("/login",{replace:true})}>
            Get Started
          </button>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <h2 className="text-center fw-bold mb-5">Why Choose TestMaster?</h2>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="card h-100 shadow-sm text-center p-3">
                <h4>📚 Topic-wise Tests</h4>
                <p>Attempt tests categorized by subjects and improve your focus where needed.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 shadow-sm text-center p-3">
                <h4>📄 Library Resources</h4>
                <p>Access curated PDF notes and learning resources to support your preparation.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 shadow-sm text-center p-3">
                <h4>💻 Practice Coding</h4>
                <p>Solve LeetCode-style programming problems in a live coding playground.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-5">
        <div className="container">
          <h2 className="text-center fw-bold mb-5">What Our Users Say</h2>
          <div className="row g-4">
            <div className="col-md-6">
              <div className="card h-100 p-3 shadow-sm">
                <p>
                  "TestMaster helped me stay consistent with daily practice. I cracked my
                  entrance exam with confidence!"
                </p>
                
              </div>
            </div>
            <div className="col-md-6">
              <div className="card h-100 p-3 shadow-sm">
                <p>
                  "The coding practice section is exactly what I needed for interviews. Highly
                  recommend it!"
                </p>
                <h6 className="mt-3 text-primary">— Mahender Yadav, Developer</h6>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-white text-center py-3">
        <p className="mb-0">&copy; {new Date().getFullYear()} TestMaster. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
