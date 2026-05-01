'use client';

/**
 * PrivacyInfo - Displays privacy information about weather data handling.
 * Transparently documents what data is stored and for how long.
 */

import React, { useState } from 'react';

export function PrivacyInfo() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="privacy-info" role="region" aria-label="Privacy information">
      <button
        className="privacy-info__header"
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
        aria-controls="privacy-info-content"
      >
        <h4 className="privacy-info__title">
          <span aria-hidden="true">🔒</span> Privacy & Data Handling
        </h4>
        <span className="privacy-info__chevron" aria-hidden="true">
          {expanded ? '▲' : '▼'}
        </span>
      </button>

      {expanded && (
        <div id="privacy-info-content" className="privacy-info__content">
          <div className="privacy-info__section">
            <h5>What data is collected?</h5>
            <ul>
              <li>
                <strong>Location:</strong> Your approximate location (city-level) is used
                solely to fetch current weather conditions. Precise GPS coordinates are
                rounded to ~11km precision before any API calls.
              </li>
              <li>
                <strong>Weather data:</strong> Current temperature and weather condition
                code from the weather provider.
              </li>
              <li>
                <strong>Preferences:</strong> Your toggle state and project override
                settings.
              </li>
            </ul>
          </div>

          <div className="privacy-info__section">
            <h5>Where is data stored?</h5>
            <ul>
              <li>
                All data is stored locally in your browser (localStorage and memory).
                No data is sent to our servers.
              </li>
              <li>
                Weather data is cached for up to 30 minutes to minimize API calls.
              </li>
              <li>
                Manual city names are stored until you change them or disable the feature.
              </li>
            </ul>
          </div>

          <div className="privacy-info__section">
            <h5>Third-party services</h5>
            <ul>
              <li>
                Weather data is fetched from{' '}
                <a
                  href="https://open-meteo.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open-Meteo
                </a>
                , an open-source weather API that requires no API key and does not
                track users.
              </li>
              <li>
                Only rounded coordinates (±11km) or city names are sent to the
                weather provider. No user identifiers are transmitted.
              </li>
            </ul>
          </div>

          <div className="privacy-info__section">
            <h5>Data retention</h5>
            <table className="privacy-info__table" aria-label="Data retention periods">
              <thead>
                <tr>
                  <th scope="col">Data Type</th>
                  <th scope="col">Storage</th>
                  <th scope="col">Duration</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Precise coordinates</td>
                  <td>Memory only</td>
                  <td>Current page session</td>
                </tr>
                <tr>
                  <td>Rounded coordinates</td>
                  <td>localStorage</td>
                  <td>Up to 30 minutes</td>
                </tr>
                <tr>
                  <td>Manual city name</td>
                  <td>localStorage</td>
                  <td>Until changed or feature disabled</td>
                </tr>
                <tr>
                  <td>Weather cache</td>
                  <td>localStorage + memory</td>
                  <td>Up to 30 minutes</td>
                </tr>
                <tr>
                  <td>User preferences</td>
                  <td>localStorage</td>
                  <td>Until cleared by user</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="privacy-info__section">
            <h5>Your controls</h5>
            <ul>
              <li>
                <strong>Disable the feature:</strong> Turning off the weather theme
                toggle immediately clears all cached weather and location data.
              </li>
              <li>
                <strong>Browser controls:</strong> You can clear all stored data by
                clearing your browser&apos;s localStorage for this site.
              </li>
              <li>
                <strong>Location permission:</strong> You can revoke location permission
                at any time through your browser settings.
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
