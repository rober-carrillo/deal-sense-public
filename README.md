# Deal Sense

A proof of concept application for business negotiation assistance, showcasing integrations with Honcho and Flowglad.

## Overview

Deal Sense helps business professionals improve their negotiation outcomes by building psychological profiles of their clients. The application demonstrates how AI-powered insights can be integrated into CRM workflows to provide actionable intelligence for sales and business development teams.

## Key Features

**Client Management**
- Client dashboard with deal tracking and status management
- Communication history and notes storage
- Contact information and relationship tracking

**Psychological Profiling**  
- AI-powered client briefings using conversation analysis
- Personality insights to guide communication strategies
- Sample queries for common negotiation scenarios

**Integrations**
- Honcho integration for building psychological profiles (stores session IDs in Supabase)
- Flowglad payment system for tiered feature access (mood tracker, analysis tools)
- OpenAI GPT for conversation analysis and insight generation

## Tech Stack

- React 18 + TypeScript + Vite
- Supabase for data persistence
- Tailwind CSS + shadcn/ui for styling
- OpenAI API for AI insights

## Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env` and configure:
   - `VITE_OPENAI_API_KEY` - For AI-powered insights
   - `VITE_SUPABASE_URL` - Database connection
   - `VITE_SUPABASE_PUBLISHABLE_KEY` - Database authentication
   - `VITE_FLOWGLAD_SECRET_KEY` - Payment processing (optional)
4. Run development server: `npm run dev`

## Usage

The application includes sample client data to demonstrate functionality. Use the "Seed Database" button to populate with example clients and communications. Click on any client card to open their psychological briefing panel.

## Purpose

This is a proof of concept built to showcase the integration capabilities of Honcho (psychological profiling) and Flowglad (subscription management) in a real-world business application focused on improving negotiation outcomes.