import { supabase } from '../lib/supabaseClient';
import OpenAI from 'openai';

const openai = new OpenAI();

export const interviewPrepService = {
  async analyzeJobPosting(jobUrl) {
    try {
      // Fetch job posting content using a web scraping function
      const jobContent = await this.scrapeJobContent(jobUrl);
      
      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [{
          role: "system",
          content: "You are an expert job interview analyst. Extract key requirements, responsibilities, and company culture points from this job posting."
        }, {
          role: "user",
          content: jobContent
        }],
      });

      return completion.choices[0].message.content;
    } catch (error) {
      console.error('Error analyzing job posting:', error);
      throw error;
    }
  },

  async analyzeInterviewerProfile(linkedinUrl) {
    try {
      // Fetch LinkedIn profile data using a scraping function
      const profileData = await this.scrapeLinkedInProfile(linkedinUrl);
      
      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [{
          role: "system",
          content: "You are an expert at professional background analysis. Analyze this LinkedIn profile and identify key talking points, shared interests, and potential conversation starters."
        }, {
          role: "user",
          content: profileData
        }],
      });

      return completion.choices[0].message.content;
    } catch (error) {
      console.error('Error analyzing interviewer profile:', error);
      throw error;
    }
  },

  async analyzeCVMatch(cvContent, jobAnalysis) {
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [{
          role: "system",
          content: "You are an expert at matching CV content with job requirements. Identify strengths to emphasize and potential gaps to address."
        }, {
          role: "user",
          content: `Job Analysis: ${jobAnalysis}\n\nCV Content: ${cvContent}`
        }],
      });

      return completion.choices[0].message.content;
    } catch (error) {
      console.error('Error analyzing CV match:', error);
      throw error;
    }
  },

  async generateInterviewPrep(userId, applicationId, jobUrl, linkedinUrl, cvContent) {
    try {
      // Run all analyses in parallel
      const [jobAnalysis, interviewerAnalysis, cvMatch] = await Promise.all([
        this.analyzeJobPosting(jobUrl),
        this.analyzeInterviewerProfile(linkedinUrl),
        this.analyzeCVMatch(cvContent, jobAnalysis)
      ]);

      // Generate comprehensive interview preparation
      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [{
          role: "system",
          content: "You are an expert interview coach. Create a comprehensive interview preparation guide based on the analyzed information."
        }, {
          role: "user",
          content: `
            Job Analysis: ${jobAnalysis}
            Interviewer Background: ${interviewerAnalysis}
            CV Match Analysis: ${cvMatch}
            
            Generate a complete interview preparation guide including:
            1. Key talking points
            2. Potential questions and suggested answers
            3. Company research highlights
            4. Technical topics to review
            5. Questions to ask the interviewer
            6. Success stories to prepare
            7. Potential concerns to address
            8. Cultural fit aspects to emphasize
          `
        }],
      });

      const prepDocument = completion.choices[0].message.content;

      // Save the prep document
      const { data, error } = await supabase
        .from('interview_prep_documents')
        .insert({
          user_id: userId,
          application_id: applicationId,
          job_analysis: jobAnalysis,
          interviewer_analysis: interviewerAnalysis,
          cv_match_analysis: cvMatch,
          prep_document: prepDocument,
          metadata: {
            job_url: jobUrl,
            linkedin_url: linkedinUrl,
            generated_at: new Date().toISOString()
          }
        })
        .select()
        .single();

      if (error) throw error;

      // Generate a formatted HTML version of the prep document
      return {
        id: data.id,
        html: this.formatPrepDocument(prepDocument),
        raw: prepDocument
      };
    } catch (error) {
      console.error('Error generating interview prep:', error);
      throw error;
    }
  },

  formatPrepDocument(prepDocument) {
    // Convert the prep document to a well-formatted HTML document
    return `
      <div class="interview-prep-document">
        <style>
          .interview-prep-document {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
          }
          .section {
            background: #f3f4f6;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
          }
          .section h2 {
            color: #2563eb;
            margin-top: 0;
          }
          .tip {
            border-left: 4px solid #2563eb;
            padding-left: 15px;
            margin: 10px 0;
          }
        </style>
        ${prepDocument.split('\n\n').map(section => `
          <div class="section">
            ${section.replace(/^#+ (.+)$/gm, '<h2>$1</h2>')}
          </div>
        `).join('')}
      </div>
    `;
  },

  // Helper methods for web scraping (implement based on your preferred scraping solution)
  async scrapeJobContent(jobUrl) {
    // Implement job posting scraping logic
    // You might want to use a service like Browserless, Puppeteer, or a dedicated scraping API
    throw new Error('Job scraping not implemented');
  },

  async scrapeLinkedInProfile(linkedinUrl) {
    // Implement LinkedIn profile scraping logic
    // You might want to use a service like Proxycurl or similar LinkedIn API providers
    throw new Error('LinkedIn scraping not implemented');
  }
}; 