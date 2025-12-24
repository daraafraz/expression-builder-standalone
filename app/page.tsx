/**
 * Expression Builder - Homepage
 * 
 * Landing page describing the project, its purpose, and features
 * 
 * @module app/page
 */

import Link from 'next/link'
import { ArrowRight, Code, Zap, Settings, FileJson, CheckCircle2 } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-800">
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto space-y-16">
          {/* Hero Section */}
          <div className="text-center space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold text-black dark:text-white">
              Expression Builder
            </h1>
            <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
              Build conditional logic for industrial operations without writing code.
              Generate production-ready JSONLogic expressions through a visual interface.
            </p>
            <div className="flex items-center justify-center gap-4 pt-4">
              <Link
                href="/demo"
                className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
              >
                Try Demo
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="https://github.com/daraafraz/expression-builder-standalone"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 border border-zinc-300 dark:border-zinc-600 text-zinc-900 dark:text-zinc-100 rounded-lg font-medium hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors"
              >
                View on GitHub
              </a>
            </div>
          </div>

          {/* Problem Statement */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-700 p-8 shadow-lg">
            <h2 className="text-2xl font-semibold text-black dark:text-white mb-4">
              The Problem
            </h2>
            <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
              Operations teams in oil & gas, manufacturing, and industrial settings need to configure 
              conditions for alarms, triggers, and automated responses. Writing these conditions in code 
              is error-prone and requires developer involvement. Manual JSON/JSONLogic creation is tedious 
              and prone to syntax errors.
            </p>
          </div>

          {/* Solution */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-700 p-8 shadow-lg">
            <h2 className="text-2xl font-semibold text-black dark:text-white mb-4">
              The Solution
            </h2>
            <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed mb-4">
              Expression Builder provides a visual, no-code interface that lets operators build complex 
              conditional logic safely. It generates production-ready JSONLogic output that can be used 
              directly in rule engines, SCADA systems, or any system that accepts JSONLogic format.
            </p>
            <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
              No coding required. No syntax errors. Just point, click, and generate.
            </p>
          </div>

          {/* Key Features */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-700 p-8 shadow-lg">
            <h2 className="text-2xl font-semibold text-black dark:text-white mb-6">
              Thoughtfully Designed Features
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Feature 1 */}
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                    <Code className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-black dark:text-white">
                    No-Code Interface
                  </h3>
                </div>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm">
                  Build expressions through dropdowns and inputs. No programming knowledge required. 
                  Designed for operations teams who understand the business logic.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                    <Zap className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-black dark:text-white">
                    Nested Calculations
                  </h3>
                </div>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm">
                  Support for complex expressions like <code className="text-xs bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded">WELL_B1_PRESSURE = (WELL_B1_TEMP + 50)</code>. 
                  Build calculations within conditions seamlessly.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                    <FileJson className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-black dark:text-white">
                    Multiple Output Formats
                  </h3>
                </div>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm">
                  Generate both JSON and JSONLogic formats. JSONLogic is the standard format for rule 
                  engines and can be evaluated with libraries like json-logic-js.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                    <Settings className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-black dark:text-white">
                    Custom Tag Configuration
                  </h3>
                </div>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm">
                  Configure your own sensor tags and data points. Perfect for industrial settings with 
                  specific naming conventions. Tags are case-sensitive and fully customizable.
                </p>
              </div>

              {/* Feature 5 */}
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-pink-100 dark:bg-pink-900 rounded-lg">
                    <CheckCircle2 className="h-5 w-5 text-pink-600 dark:text-pink-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-black dark:text-white">
                    Live Preview & Validation
                  </h3>
                </div>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm">
                  See your expression in real-time with syntax highlighting. Get natural language 
                  descriptions to validate your logic before generating output.
                </p>
              </div>

              {/* Feature 6 */}
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-cyan-100 dark:bg-cyan-900 rounded-lg">
                    <Zap className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-black dark:text-white">
                    Production Ready
                  </h3>
                </div>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm">
                  Generated expressions are immediately usable in production systems. No manual editing 
                  or syntax correction needed. Copy and paste into your rule engine.
                </p>
              </div>
            </div>
          </div>

          {/* Use Cases */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-700 p-8 shadow-lg">
            <h2 className="text-2xl font-semibold text-black dark:text-white mb-4">
              Who It&apos;s For
            </h2>
            <ul className="space-y-3 text-zinc-700 dark:text-zinc-300">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                <span><strong>Operations Engineers</strong> configuring alarm conditions in SCADA systems</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                <span><strong>Process Control Engineers</strong> setting up automated triggers</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                <span><strong>Industrial Automation Teams</strong> building rule-based logic</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                <span><strong>Developers</strong> who need to generate JSONLogic expressions for rule engines</span>
              </li>
            </ul>
          </div>

          {/* CTA */}
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-semibold text-black dark:text-white">
              Ready to try it?
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400">
              Explore the interactive demo and see how easy it is to build expressions
            </p>
            <Link
              href="/demo"
              className="inline-flex items-center gap-2 px-8 py-4 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors text-lg"
            >
              Launch Demo
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
