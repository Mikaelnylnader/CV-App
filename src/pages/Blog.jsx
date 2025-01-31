import React, { useEffect } from 'react';
import { Container, Typography, Grid, Paper, Box, Button } from '@mui/material';
import BlogPost from '../components/blog/BlogPost';
import BlogPostView from '../components/blog/BlogPostView';
import { styled } from '@mui/material/styles';
import CategoryChip from '../components/CategoryChip.jsx';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { Routes, Route, useLocation } from 'react-router-dom';

const blogPosts = [
  {
    id: 1,
    title: "How to Write an Effective Resume in 2025",
    date: "March 15, 2025",
    author: "Sarah Anderson",
    role: "Senior Career Expert & Former Google Recruiter",
    summary: "Master the latest resume writing strategies for 2025, including AI optimization, skills-based formatting, and automated tracking system (ATS) compatibility.",
    content: `In today's AI-driven job market, crafting an effective resume requires a strategic blend of traditional best practices and modern technological considerations. As a former Google recruiter with over 12 years of experience in talent acquisition, I'll guide you through the essential steps to create a resume that not only catches the eye of hiring managers but also successfully navigates automated screening systems.

## Hear from Our Expert

![Sarah Anderson - Career Expert](https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=2070&auto=format&fit=crop)

> "Having reviewed thousands of resumes throughout my career at Google and other tech giants, I've witnessed the evolution of resume screening firsthand. In 2025, the biggest challenge job seekers face is standing out in a world where AI gatekeepers meet human decision-makers. The key is finding the perfect balance between optimization and authenticity."
>
> *— Sarah Anderson, Senior Career Expert & Former Google Recruiter*

During my tenure as a recruiter, I've seen countless qualified candidates get overlooked due to poorly optimized resumes. That's why I'm passionate about helping job seekers understand both the technical and human aspects of modern resume writing. The strategies I'm sharing today are based on real-world success stories and data-driven insights from my experience in talent acquisition.

## Why Your Resume Needs to Evolve in 2025

The job application landscape has transformed significantly. With 97% of Fortune 500 companies now using Applicant Tracking Systems (ATS) and AI-powered screening tools, your resume needs to be optimized for both human and machine readers.

![ATS System Analysis](https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=2070&auto=format&fit=crop)

### Key Statistics for 2025:
- Average time recruiters spend on initial resume review: 6.5 seconds
- 75% of resumes never reach human reviewers due to ATS rejection
- 82% of employers prefer skills-based resumes over chronological formats
- AI screening tools are used by 55% of hiring managers

## Essential Elements of a 2025 Resume

### 1. Strategic Formatting for ATS Compatibility

Your resume must be machine-readable while maintaining visual appeal. Here's how:

- Use clean, standard fonts (Arial, Calibri, or Times New Roman)
- Implement clear section headings (Experience, Skills, Education)
- Avoid tables, graphics, or complex formatting
- Save in the correct file format (PDF or .docx)

![Resume Format Example](https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=2070&auto=format&fit=crop)

### 2. Skills-First Approach

Modern resumes prioritize skills over chronological work history:

- Create a prominent skills section at the top
- Include both hard and soft skills
- Quantify skill proficiency levels
- Match skills with job requirements

### 3. Achievement-Focused Content

Transform job descriptions into achievement statements:

✅ DO:
- "Increased team productivity by 45% through implementation of automated workflows"
- "Generated $200K in additional revenue through customer retention initiatives"
- "Led a team of 12 developers in completing project 3 weeks ahead of schedule"

❌ DON'T:
- "Responsible for team management"
- "Handled customer service"
- "Worked on development projects"

### 4. AI-Friendly Keywords

![Keyword Optimization](https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=2070&auto=format&fit=crop)

Incorporate relevant keywords naturally:
- Industry-specific terms
- Technical skills
- Soft skills
- Action verbs
- Job-specific qualifications

## Advanced Tips for 2025

### 1. Digital Integration
Include links to:
- LinkedIn profile
- Professional portfolio
- GitHub repository (for tech roles)
- Professional social media presence

### 2. Personal Branding Statement
Create a compelling professional summary that:
- Aligns with your target role
- Highlights unique value proposition
- Incorporates relevant keywords
- Shows personality and culture fit

### 3. Remote Work Skills
Emphasize abilities crucial for remote work:
- Virtual collaboration
- Time management
- Digital communication
- Self-motivation
- Tech tool proficiency

## Common Mistakes to Avoid in 2025

1. Overusing AI-generated content
2. Neglecting mobile optimization
3. Including outdated skills
4. Using generic templates
5. Forgetting to customize for each application

## Resume Writing Checklist for 2025

✓ ATS-compatible format
✓ Keyword optimization
✓ Quantifiable achievements
✓ Skills-based structure
✓ Digital integration
✓ Personal branding
✓ Mobile-friendly design

![Final Resume Check](https://images.unsplash.com/photo-1521898284481-a5ec348cb555?q=80&w=2070&auto=format&fit=crop)

## Expert's Final Thoughts

After reviewing over 10,000 resumes throughout my career, I can confidently say that success lies in the details. The most effective resumes I've seen aren't just well-written documents – they're strategic marketing tools that tell a compelling story while meeting technical requirements.

Remember, your resume is often your first impression on potential employers. In 2025's competitive job market, it's crucial to make it count. Keep testing and refining your resume based on feedback and results, and don't hesitate to seek professional guidance when needed.

## Additional Resources

- [Download our ATS-friendly resume templates]
- [Check out our resume scanning tool]
- [Schedule a professional resume review]

*Want personalized resume advice? Feel free to connect with me on LinkedIn or book a consultation through our platform. Let's work together to make your resume stand out in 2025 and beyond.*`,
    imageUrl: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=2070&auto=format&fit=crop",
    slug: "how-to-write-effective-resume-2025",
    readTime: "8 min read",
    tags: ["Resume Writing", "Career Advice", "Job Search", "ATS Optimization", "Professional Development"]
  },
  {
    id: 2,
    title: "The Art of Cover Letter Writing",
    date: "March 12, 2025",
    author: "Michael Chen",
    role: "Professional Writing Coach & Career Strategist",
    summary: "Learn how to craft compelling cover letters that grab employers' attention and significantly increase your interview chances.",
    content: `In the competitive landscape of 2025's job market, a well-crafted cover letter can be your secret weapon. As a Professional Writing Coach with over a decade of experience, I've helped thousands of job seekers transform their cover letters from generic introductions into powerful personal marketing tools.

## The Modern Cover Letter: What's Changed in 2025

The traditional cover letter has evolved significantly. Today's successful cover letters are:
- Concise yet impactful
- Highly personalized
- Data-driven
- Story-focused
- ATS-optimized

![Professional Writing](https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=2073&auto=format&fit=crop)

## Why Cover Letters Still Matter

Despite technological advances in hiring, cover letters remain crucial because they:
- Provide context for career transitions
- Demonstrate communication skills
- Show cultural fit
- Express genuine interest
- Address potential concerns

### Key Statistics:
- 83% of hiring managers read cover letters for executive positions
- 60% consider cover letters important for evaluating culture fit
- 76% prefer personalized cover letters over generic ones
- 48% of job seekers who included a cover letter got an interview

## Essential Elements of a Winning Cover Letter

### 1. The Perfect Opening
Your first paragraph must grab attention. Start with:
- A compelling hook
- A mutual connection mention
- An exciting company achievement
- Your passion for the role

✅ Example:
"When I read about [Company]'s recent breakthrough in sustainable technology on TechCrunch, I knew my 5 years of experience in green energy innovation would make me an ideal candidate for the Senior Project Manager position."

### 2. The Value Proposition
Your second paragraph should answer:
- Why you're the perfect fit
- What unique value you bring
- How your experience aligns with their needs

✅ Example:
"At my current role, I increased project delivery efficiency by 40% while reducing costs by 25% through implementing agile methodologies. I'm excited to bring this experience to [Company]'s growing project management team."

### 3. The Story Element
Share a brief, relevant success story that:
- Demonstrates key achievements
- Shows problem-solving abilities
- Illustrates leadership skills
- Proves cultural alignment

### 4. The Strong Close
End with:
- A clear call to action
- Enthusiasm for next steps
- Gratitude for their time
- Professional sign-off

## Modern Cover Letter Best Practices

### Do's:
- Research the company thoroughly
- Address the hiring manager by name
- Customize for each application
- Use industry-specific keywords
- Keep it to one page
- Proofread meticulously

### Don'ts:
- Use generic templates
- Repeat your resume
- Include irrelevant information
- Write more than 400 words
- Use complex formatting
- Forget to update contact information

## Digital Integration Tips

Modern cover letters should be:
1. ATS-compatible
2. Mobile-responsive
3. Easy to scan
4. Properly formatted for digital sharing

## Expert Tips for Common Situations

### Career Transition
Emphasize transferable skills and explain your motivation for the change.

### Employment Gaps
Address them briefly and positively, focusing on personal development during the gap.

### Industry Switch
Highlight relevant projects and skills that bridge your previous and target industries.

## Cover Letter Template Structure

\`\`\`
[Your Name]
[Your Contact Information]

[Date]

[Hiring Manager's Name]
[Company Name]
[Company Address]

Dear [Hiring Manager's Name],

[Opening Paragraph: Hook and Connection]

[Body Paragraph 1: Value Proposition]

[Body Paragraph 2: Relevant Story/Achievement]

[Closing Paragraph: Call to Action]

Best regards,
[Your Name]
\`\`\`

## Real-World Success Story

> "After implementing these strategies, one of my clients saw their interview rate increase from 12% to 48%. The key was crafting a narrative that aligned their experience perfectly with each company's needs."
>
> *— Michael Chen, Professional Writing Coach*

## Common Mistakes to Avoid

1. Generic openings ("I am writing to apply...")
2. Excessive length
3. Focusing on wants instead of value
4. Poor formatting
5. Lack of research
6. Typos and grammatical errors

## The Future of Cover Letters

As we move forward, cover letters are becoming more:
- Interactive
- Data-driven
- Multimedia-integrated
- Personality-focused

## Additional Resources

- [Download our Cover Letter Templates]
- [Access our Writing Guide]
- [Book a Review Session]

## Final Thoughts

Remember, your cover letter is often your first impression. Make it count by being authentic, specific, and compelling. Focus on the employer's needs and how you can meet them.

*Need personalized advice? Connect with me on LinkedIn or schedule a consultation through our platform. Let's craft a cover letter that opens doors to your dream career.*`,
    imageUrl: "https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=2073&auto=format&fit=crop",
    slug: "art-of-cover-letter-writing",
    readTime: "7 min read",
    tags: ["Cover Letters", "Job Application", "Writing Tips", "Career Advice"]
  },
  {
    id: 3,
    title: "Networking Tips for Job Seekers",
    date: "March 8, 2025",
    author: "Emily Rodriguez",
    role: "Networking Specialist & LinkedIn Top Voice",
    summary: "Discover effective networking strategies that combine traditional relationship-building with modern digital techniques.",
    content: `As a networking specialist and LinkedIn Top Voice, I've witnessed how digital transformation has revolutionized professional networking. Here's your comprehensive guide to networking in 2025.

## The Evolution of Professional Networking

Modern networking combines traditional relationship-building with digital strategies, creating more opportunities than ever to connect meaningfully.

![Networking Event](https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=2070&auto=format&fit=crop)

### Current Trends:
- Virtual networking events
- AI-powered connection matching
- Industry-specific online communities
- Hybrid networking approaches

## Key Networking Strategies

### 1. Digital Presence Optimization
- Professional social media profiles
- Personal branding
- Content creation
- Online engagement

### 2. Virtual Networking Events
- Online conferences
- Virtual meetups
- Digital coffee chats
- Industry webinars

### 3. Relationship Building
- Follow-up strategies
- Value-first approach
- Long-term connection nurturing
- Authentic engagement

## Best Practices for Modern Networking

### Digital Networking
- Optimize your LinkedIn profile
- Engage with industry content
- Share your expertise
- Join relevant groups

### In-Person Networking
- Prepare your elevator pitch
- Focus on quality conversations
- Follow up promptly
- Stay organized

## Tools and Resources
- LinkedIn Premium
- Networking apps
- CRM systems
- Event platforms

## Success Stories and Case Studies

[Include success stories from real networking experiences]

## Additional Resources
- [Networking Templates]
- [Event Calendar]
- [Connection Tracking Tools]`,
    imageUrl: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=2070&auto=format&fit=crop",
    slug: "networking-tips-job-seekers",
    readTime: "6 min read",
    tags: ["Networking", "Professional Development", "LinkedIn", "Career Growth"]
  },
  {
    id: 4,
    title: "Mastering ATS-Friendly Resume Formats",
    date: "March 18, 2025",
    author: "David Park",
    role: "Technical Recruiter & ATS Expert",
    summary: "Learn the technical aspects of creating resumes that successfully pass through Applicant Tracking Systems while maintaining human appeal.",
    content: `As an ATS expert with extensive experience in technical recruiting, I'll guide you through creating resumes that work for both machines and humans.

[Detailed content about ATS optimization...]`,
    imageUrl: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=2070&auto=format&fit=crop",
    slug: "mastering-ats-friendly-resume-formats",
    readTime: "9 min read",
    tags: ["ATS", "Resume Writing", "Technical Skills", "Job Search"]
  },
  {
    id: 5,
    title: "Top Skills to Include in Your 2025 CV",
    date: "March 16, 2025",
    author: "Jennifer Lee",
    role: "Skills Development Coach & Industry Analyst",
    summary: "Stay ahead of the curve by highlighting the most in-demand skills employers are looking for in 2025.",
    content: `As a Skills Development Coach and Industry Analyst, I've spent years tracking evolving workplace demands and helping professionals stay competitive. Here's your comprehensive guide to the most valuable skills for 2025.

## The Shifting Skills Landscape

![Skills Evolution](https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=2070&auto=format&fit=crop)

The workplace continues to evolve rapidly, driven by:
- Artificial Intelligence integration
- Remote work normalization
- Digital transformation
- Global collaboration
- Sustainability focus

## Top Technical Skills for 2025

### 1. AI and Machine Learning Literacy
- Understanding AI capabilities and limitations
- Basic prompt engineering
- AI tool integration
- Data interpretation
- Automated system management

### 2. Digital Collaboration Tools
- Advanced project management platforms
- Virtual team coordination
- Cloud-based workflow systems
- Digital whiteboarding
- Remote presentation skills

### 3. Data Analytics
- Data visualization
- Basic SQL knowledge
- Analytics tool proficiency
- Reporting and dashboarding
- Data-driven decision making

### 4. Cybersecurity Awareness
- Basic security protocols
- Password management
- Data privacy compliance
- Secure communication
- Threat recognition

## Essential Soft Skills

![Soft Skills Importance](https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop)

### 1. Adaptive Thinking
- Change management
- Learning agility
- Problem-solving
- Innovation mindset
- Flexibility

### 2. Digital Communication
- Virtual meeting etiquette
- Clear written communication
- Cross-cultural awareness
- Asynchronous collaboration
- Digital body language

### 3. Emotional Intelligence
- Self-awareness
- Empathy
- Conflict resolution
- Team motivation
- Stress management

## Emerging Skills for 2025

### 1. Sustainability Literacy
- Environmental impact awareness
- Sustainable business practices
- Green technology understanding
- Carbon footprint management
- Circular economy principles

### 2. Virtual Leadership
- Remote team management
- Digital culture building
- Virtual motivation techniques
- Online community management
- Distance coaching

### 3. Cognitive Flexibility
- Multi-disciplinary thinking
- Complex problem solving
- Pattern recognition
- Strategic planning
- Creative innovation

## Industry-Specific Skills Trends

### Technology Sector
✅ Must-Have Skills:
- Cloud computing
- DevOps practices
- API integration
- Microservices architecture
- Container orchestration

### Finance Industry
✅ Priority Skills:
- Blockchain understanding
- Fintech awareness
- Digital banking
- Cryptocurrency basics
- Automated trading concepts

### Healthcare Field
✅ Critical Skills:
- Telehealth protocols
- Digital health records
- Remote patient monitoring
- Health data privacy
- Medical technology operation

## How to Showcase Skills Effectively

### 1. Skills Section Organization
Structure your skills section by:
- Core competencies
- Technical abilities
- Soft skills
- Industry knowledge
- Certifications

### 2. Quantifiable Achievements
Demonstrate skills through:
- Project outcomes
- Performance metrics
- Team improvements
- Process optimizations
- Revenue impact

### 3. Continuous Learning
Highlight:
- Recent certifications
- Online courses
- Workshop participation
- Industry conferences
- Self-directed learning

## Skills Development Strategy

![Learning Strategy](https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=2070&auto=format&fit=crop)

### 1. Assessment Phase
- Identify skill gaps
- Research industry demands
- Set learning priorities
- Create development timeline
- Choose learning resources

### 2. Learning Methods
- Online courses
- Mentorship programs
- Industry certifications
- Practical projects
- Peer learning groups

### 3. Implementation Plan
- Set measurable goals
- Track progress
- Seek feedback
- Apply skills practically
- Document achievements

## Future-Proofing Your Skill Set

### 1. Stay Informed
- Follow industry trends
- Join professional networks
- Read thought leadership
- Attend webinars
- Participate in forums

### 2. Build Adaptability
- Cross-functional projects
- Role rotation
- Diverse experiences
- International exposure
- Innovation initiatives

## Expert Tips

> "The most successful professionals in 2025 will be those who combine technical proficiency with strong human skills. It's not just about what you know, but how you apply it in an ever-changing workplace."
>
> *— Jennifer Lee, Skills Development Coach*

## Common Mistakes to Avoid

1. Overlooking soft skills
2. Focusing only on technical abilities
3. Neglecting continuous learning
4. Missing industry-specific skills
5. Failing to quantify skill levels

## Action Steps for Skill Development

1. Assess your current skill set
2. Identify gaps in your industry
3. Create a learning plan
4. Set measurable goals
5. Track your progress
6. Seek regular feedback
7. Update your CV regularly

## Additional Resources

- [Download our Skills Assessment Template]
- [Access our Learning Path Guide]
- [Join our Skills Development Community]

## Final Thoughts

The key to staying competitive in 2025 is maintaining a balanced skill set that combines technical proficiency with strong human capabilities. Focus on continuous learning and adaptability, and always be ready to evolve with industry demands.

*Need personalized guidance on skill development? Connect with me on LinkedIn or schedule a consultation. Let's create your personalized skills roadmap for 2025 and beyond.*`,
    imageUrl: "https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=2070&auto=format&fit=crop",
    slug: "top-skills-2025-cv",
    readTime: "7 min read",
    tags: ["Skills Development", "Career Planning", "Professional Growth"]
  },
  {
    id: 6,
    title: "Remote Job Applications: A Complete Guide",
    date: "March 14, 2025",
    author: "Alex Thompson",
    role: "Remote Work Specialist",
    summary: "Master the art of applying for and landing remote positions in today's digital-first job market.",
    content: `[Detailed content about remote job applications...]`,
    imageUrl: "https://images.unsplash.com/photo-1521898284481-a5ec348cb555?q=80&w=2070&auto=format&fit=crop",
    slug: "remote-job-applications-guide",
    readTime: "8 min read",
    tags: ["Remote Work", "Job Search", "Digital Skills"]
  },
  {
    id: 7,
    title: "Career Change CV Writing Guide",
    date: "March 10, 2025",
    author: "Rachel Martinez",
    role: "Career Transition Coach",
    summary: "Learn how to effectively present your skills and experience when making a career transition.",
    content: `[Detailed content about career change CVs...]`,
    imageUrl: "https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?q=80&w=2070&auto=format&fit=crop",
    slug: "career-change-cv-guide",
    readTime: "10 min read",
    tags: ["Career Change", "CV Writing", "Professional Development"]
  },
  {
    id: 8,
    title: "Leveraging AI Tools in Your Job Search",
    date: "March 6, 2025",
    author: "Tom Wilson",
    role: "AI & Career Technology Expert",
    summary: "Discover how to effectively use AI-powered tools to enhance your job search and application process.",
    content: `[Detailed content about AI tools in job search...]`,
    imageUrl: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=2070&auto=format&fit=crop",
    slug: "ai-tools-job-search",
    readTime: "8 min read",
    tags: ["AI Technology", "Job Search", "Digital Tools", "Career Tech"]
  }
];

const HighlightedText = styled('span')(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: 'white',
  padding: '0.2em 0.5em',
  boxDecorating: 'clone',
  lineHeight: 1.4,
}));

const Blog = () => {
  const location = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  console.log('Current location:', location.pathname);

  return (
    <Routes>
      <Route
        path="/"
        element={
          <>
            <Box
              sx={{
                background: `linear-gradient(rgba(10, 15, 30, 0.9), rgba(26, 31, 46, 0.95)), url('https://images.unsplash.com/photo-1456324504439-367cee3b3c32?q=80&w=2070&auto=format&fit=crop')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed',
                color: 'white',
                py: { xs: 8, md: 12 },
                mb: 6,
                minHeight: '60vh',
                display: 'flex',
                alignItems: 'center',
                position: 'relative',
              }}
            >
              <Container maxWidth="lg">
                <Box sx={{ 
                  maxWidth: '800px', 
                  mx: 'auto', 
                  textAlign: 'center',
                  position: 'relative',
                  zIndex: 1
                }}>
                  <Typography
                    variant="h1"
                    component="h1"
                    sx={{ 
                      fontWeight: 800,
                      fontSize: { xs: '2rem', md: '3.5rem' },
                      mb: 3,
                      lineHeight: 1.2,
                      color: 'white',
                      textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                    }}
                  >
                    Blog
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{
                      fontSize: { xs: '1.1rem', md: '1.25rem' },
                      lineHeight: 1.6,
                      maxWidth: '600px',
                      mx: 'auto',
                      mb: 4,
                      color: 'rgba(255, 255, 255, 0.9)',
                      textShadow: '0 1px 2px rgba(0,0,0,0.2)'
                    }}
                  >
                    Discover expert insights and strategies for mastering your job search journey
                  </Typography>
                </Box>
              </Container>
            </Box>
      
            <Container maxWidth="lg" sx={{ py: 8 }}>
              <Grid container spacing={4}>
                {blogPosts.map((post) => (
                  <Grid item xs={12} md={6} key={post.id}>
                    <BlogPost post={post} />
                  </Grid>
                ))}
              </Grid>
            </Container>
          </>
        }
      />
      <Route 
        path=":slug" 
        element={<BlogPostView posts={blogPosts} />} 
      />
    </Routes>
  );
};

export default Blog;