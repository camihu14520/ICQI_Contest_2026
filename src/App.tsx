/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { AboutSection } from './components/AboutSection';
import { TimelineSection } from './components/TimelineSection';
import { AwardsSection } from './components/AwardsSection';
import { RegistrationForm } from './components/RegistrationForm';
import { StatusLookup } from './components/StatusLookup';
import { DownloadsSection } from './components/DownloadsSection';
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';
import { CompetitionRegistration } from './types/competition';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('overview');

  const handleRegistrationCompleted = (reg: CompetitionRegistration) => {
    // Keep updated state
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      
      {/* Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Content Areas */}
      <main className="flex-1">
        {activeTab === 'overview' && (
          <>
            <HeroSection
              onRegisterClick={() => setActiveTab('register')}
              onLookupClick={() => setActiveTab('lookup')}
              onDownloadsClick={() => setActiveTab('downloads')}
            />
            <AboutSection />
            <TimelineSection onRegisterClick={() => setActiveTab('register')} />
            <AwardsSection />
            <RegistrationForm
              onSuccessfulSubmit={handleRegistrationCompleted}
              onNavigateLookup={() => setActiveTab('lookup')}
            />
            <StatusLookup
              onRegisterClick={() => setActiveTab('register')}
            />
            <DownloadsSection />
            <FaqSection />
          </>
        )}

        {activeTab === 'timeline' && (
          <div className="py-8">
            <TimelineSection onRegisterClick={() => setActiveTab('register')} />
          </div>
        )}

        {activeTab === 'awards' && (
          <div className="py-8">
            <AwardsSection />
          </div>
        )}

        {activeTab === 'register' && (
          <div className="py-8">
            <RegistrationForm
              onSuccessfulSubmit={handleRegistrationCompleted}
              onNavigateLookup={() => setActiveTab('lookup')}
            />
          </div>
        )}

        {activeTab === 'lookup' && (
          <div className="py-8">
            <StatusLookup
              onRegisterClick={() => setActiveTab('register')}
            />
          </div>
        )}

        {activeTab === 'downloads' && (
          <div className="py-8">
            <DownloadsSection />
          </div>
        )}

        {activeTab === 'faq' && (
          <div className="py-8">
            <FaqSection />
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer setActiveTab={setActiveTab} />

    </div>
  );
}
