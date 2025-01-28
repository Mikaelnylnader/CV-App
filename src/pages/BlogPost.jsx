import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

export default function BlogPost() {
  const { id } = useParams();
  const navigate = useNavigate();

  const blogPosts = {
    3: {
      title: "The Future of Job Applications",
      description: "Explore how technology is shaping the future of job applications and what it means for job seekers in the coming years.",
      date: "2024-01-06",
      author: "Emily Rodriguez",
      authorRole: "Future of Work Analyst",
      readTime: "7 min read",
      imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
      sections: [
        {
          title: "The Digital Transformation of Job Applications",
          content: "The job application process is undergoing a radical transformation. With the rise of AI, blockchain credentials, and virtual interviews, the traditional resume is evolving into a dynamic digital portfolio. Companies are adopting innovative technologies to streamline hiring and find the best talent globally.",
          imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
        },
        {
          title: "Key Trends Shaping the Future",
          content: "Several major trends are reshaping how we apply for jobs:\n\n1. AI-Powered Matching\nAdvanced algorithms match candidates with opportunities based on skills, experience, and cultural fit.\n\n2. Virtual Reality Assessments\nCompanies use VR for skill demonstrations and cultural fit evaluation.\n\n3. Blockchain Credentials\nVerifiable digital credentials ensure trust and transparency in qualifications.\n\n4. Continuous Assessment\nOngoing evaluation replaces point-in-time hiring decisions.\n\n5. Global Talent Pools\nRemote work enables truly global hiring practices.",
          imageUrl: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
        },
        {
          title: "Preparing for the Future",
          content: "To succeed in the future job market, candidates should:\n\n- Build a strong digital presence across multiple platforms\n- Develop skills in emerging technologies\n- Create compelling digital portfolios\n- Master virtual communication\n- Embrace continuous learning\n- Adapt to new assessment methods",
          imageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
        }
      ],
      faq: [
        {
          q: "Will traditional resumes become obsolete?",
          a: "While traditional resumes won't disappear entirely, they'll evolve into more dynamic, digital formats that showcase skills and experience in interactive ways."
        },
        {
          q: "How important will AI be in future job applications?",
          a: "AI will play a crucial role in matching candidates with opportunities, but human judgment will remain important for final hiring decisions."
        },
        {
          q: "What skills will be most important?",
          a: "Digital literacy, adaptability, and continuous learning will be essential, along with strong virtual collaboration and communication skills."
        }
      ]
    },
    4: {
      title: "Mastering ATS-Friendly Resumes",
      description: "A comprehensive guide to creating resumes that successfully pass through Applicant Tracking Systems (ATS) while maintaining human appeal.",
      date: "2024-01-05",
      author: "David Wilson",
      authorRole: "ATS Optimization Expert",
      readTime: "9 min read",
      imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
      sections: [
        {
          title: "Understanding ATS Systems",
          content: "Applicant Tracking Systems are software applications used by employers to streamline the hiring process. They scan resumes for keywords, qualifications, and other criteria to determine if a candidate is a good fit for the position. If your resume isn't ATS-friendly, it might never reach human eyes.",
          imageUrl: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
        },
        {
          title: "Key Elements of an ATS-Friendly Resume",
          content: "1. Use Relevant Keywords\nTailor your resume to the job description by incorporating relevant keywords. These are often found in the job posting under required skills and qualifications.\nAvoid keyword stuffing. Use them naturally within your resume.\n\n2. Simple Formatting\nStick to standard fonts like Arial, Times New Roman, or Calibri.\nUse bullet points for easy readability.\nAvoid graphics, images, and complex formatting that might confuse the ATS.\n\n3. Clear Section Headings\nUse standard headings like \"Work Experience,\" \"Education,\" and \"Skills.\"\nEnsure your headings are easily recognizable by the ATS.\n\n4. Consistent Structure\nMaintain a consistent format throughout your resume.\nUse reverse chronological order for your work experience.\n\n5. Avoid Special Characters\nStick to plain text and avoid special characters or symbols that might not be recognized by the ATS.",
          imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
        },
        {
          title: "Crafting Your Content",
          content: "1. Professional Summary\nStart with a strong professional summary that highlights your key qualifications and career goals.\nKeep it concise and focused on what you bring to the table.\n\n2. Work Experience\nDetail your work experience with clear job titles, company names, and dates of employment.\nUse action verbs and quantify your achievements where possible.\n\n3. Skills\nList relevant skills that match the job description.\nInclude both hard and soft skills.\n\n4. Education\nProvide details of your educational background, including degrees, institutions, and graduation dates.",
          imageUrl: "https://images.unsplash.com/photo-1434626881859-194d67b2b86f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
        }
      ],
      faq: [
        {
          q: "How effective is AI in resume writing?",
          a: "AI has shown to increase interview callback rates by up to 300% through optimized keyword usage and formatting that appeals to both ATS systems and human recruiters."
        },
        {
          q: "Is it ethical to use AI for resume optimization?",
          a: "Using AI tools for resume optimization is completely ethical and increasingly expected in today's job market. These tools help present your authentic experience in the most effective way."
        },
        {
          q: "Will AI replace human resume writers?",
          a: "AI is a powerful tool that enhances rather than replaces human input. The best results come from combining AI optimization with human creativity and judgment."
        }
      ]
    },
    5: {
      title: "The Power of Keywords in Your Resume",
      description: "Understanding how to effectively use keywords to make your resume stand out to employers and AI systems.",
      date: "2024-01-04",
      author: "Lisa Thompson",
      authorRole: "SEO & Resume Optimization Specialist",
      readTime: "6 min read",
      imageUrl: "https://images.unsplash.com/photo-1518976024611-28bf4b48222e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
      sections: [
        {
          title: "Why Keywords Matter",
          content: "Keywords are the bridge between your resume and job opportunities. They help your resume get noticed by both ATS systems and human recruiters, increasing your chances of landing an interview.",
          imageUrl: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
        },
        {
          title: "Finding the Right Keywords",
          content: "Effective keyword research involves:\n\n1. Analyzing Job Descriptions\nStudy multiple listings for your target role.\n\n2. Industry Research\nIdentify trending skills and technologies.\n\n3. Company Research\nUnderstand company-specific terminology.\n\n4. Competitor Analysis\nReview profiles of successful professionals.\n\n5. Skills Assessment\nMatch your skills with industry demands.",
          imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
        },
        {
          title: "Implementing Keywords Effectively",
          content: "Best practices for keyword implementation:\n\n- Use natural language and context\n- Include both acronyms and full terms\n- Balance keyword density\n- Incorporate action verbs\n- Use industry-specific terminology\n- Update keywords regularly",
          imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
        }
      ],
      faq: [
        {
          q: "How many keywords should I include?",
          a: "Focus on quality over quantity. Include relevant keywords naturally throughout your resume, aiming for about 15-20 key terms specific to your industry and the job."
        },
        {
          q: "Should I use exact keyword matches?",
          a: "Use a mix of exact matches and variations to sound natural while still being ATS-friendly."
        },
        {
          q: "How often should I update my keywords?",
          a: "Review and update keywords every 3-6 months or when applying to different positions to stay current with industry trends."
        }
      ]
    },
    6: {
      title: "Remote Work Resume Tips",
      description: "Essential tips for tailoring your resume for remote positions in the post-pandemic job market.",
      date: "2024-01-03",
      author: "James Martinez",
      authorRole: "Remote Work Specialist",
      readTime: "7 min read",
      imageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
      sections: [
        {
          title: "The Remote Work Revolution",
          content: "Remote work has become a permanent fixture in the modern workplace. Understanding how to position yourself for remote roles is crucial for career success in this new era.",
          imageUrl: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
        },
        {
          title: "Essential Remote Work Skills",
          content: "Key skills to highlight include:\n\n1. Digital Communication\nProficiency in virtual collaboration tools.\n\n2. Self-Management\nDemonstrated ability to work independently.\n\n3. Time Management\nStrong organizational and prioritization skills.\n\n4. Technical Proficiency\nFamiliarity with remote work tools.\n\n5. Cross-Cultural Communication\nAbility to work with global teams.",
          imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
        },
        {
          title: "Optimizing Your Resume for Remote Roles",
          content: "Best practices for remote job applications:\n\n- Highlight previous remote work experience\n- Showcase virtual collaboration achievements\n- Emphasize communication skills\n- List relevant remote tools and technologies\n- Demonstrate results-driven mindset\n- Include remote work certifications",
          imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
        }
      ],
      faq: [
        {
          q: "Do I need previous remote experience?",
          a: "While helpful, it's not mandatory. Focus on transferable skills and any experience working independently or across locations."
        },
        {
          q: "What tools should I be familiar with?",
          a: "Knowledge of video conferencing (Zoom, Teams), project management (Asana, Trello), and communication (Slack) tools is essential."
        },
        {
          q: "How do I show I'm suited for remote work?",
          a: "Emphasize self-motivation, time management, and successful completion of independent projects in your experience section."
        }
      ]
    },
    2: {
      title: "Top 10 Resume Mistakes to Avoid in 2025",
      description: "Stay ahead of the curve by avoiding these critical resume mistakes that could cost you your dream job in 2025. Learn what recruiters and AI systems are looking for.",
      date: "2024-01-09",
      author: "Michael Chen",
      authorRole: "Career Strategy Expert",
      readTime: "10 min read",
      imageUrl: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
      sections: [
        {
          title: "The Evolving Landscape of Job Applications",
          content: "As we approach 2025, the job application process continues to evolve with advanced AI systems and changing recruiter expectations. Understanding and avoiding these critical resume mistakes is more important than ever for standing out in a competitive job market.",
          imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
        },
        {
          title: "Top 10 Resume Mistakes to Avoid",
          content: "Here are the top 10 resume mistakes to avoid in 2025:\n\n1. Ignoring AI-Readability\nYour resume must be optimized for both AI screening tools and human readers. Avoid complex formatting that AI can't parse.\n\n2. Generic AI-Generated Content\nWhile AI tools are helpful, using generic AI-generated content without personalization will make your resume bland.\n\n3. Outdated Technical Skills\nNot updating your technical skills section with emerging technologies and tools shows you're not keeping pace with industry changes.\n\n4. Missing Impact Metrics\nFailing to quantify your achievements with specific metrics and ROI makes your contributions less credible.\n\n5. Poor Digital Integration\nNot including links to your digital portfolio, LinkedIn profile, or relevant online presence is a missed opportunity.\n\n6. Neglecting Soft Skills\nIn 2025's hybrid workplace, soft skills like virtual collaboration and adaptive learning are crucial.\n\n7. Over-Optimization\nStuffing your resume with keywords to beat AI systems will backfire when human recruiters review it.\n\n8. Inconsistent Personal Branding\nYour resume should align with your online presence and other application materials.\n\n9. Traditional Chronological Format\nSticking to rigid chronological formats instead of skills-based or hybrid formats can limit your appeal.\n\n10. Missing Remote Work Skills\nNot highlighting remote work capabilities and virtual collaboration tools is a significant oversight.",
          imageUrl: "https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
        },
        {
          title: "Solutions and Best Practices",
          content: "To avoid these mistakes, follow these updated best practices:\n\n- Use ATS-friendly formats while maintaining visual appeal\n- Include a skills matrix highlighting both technical and soft skills\n- Quantify achievements with specific metrics and outcomes\n- Integrate digital elements strategically\n- Highlight remote work and virtual collaboration capabilities\n- Maintain consistency across all professional platforms",
          imageUrl: "https://images.unsplash.com/photo-1434626881859-194d67b2b86f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
        }
      ],
      faq: [
        {
          q: "How important is AI optimization in 2025?",
          a: "AI optimization is crucial as over 90% of large companies use ATS systems. However, balance is key - optimize for AI while keeping the content engaging for human readers."
        },
        {
          q: "Should I completely avoid traditional resume formats?",
          a: "Not necessarily. The key is to adapt traditional formats with modern elements like skills matrices and digital integration while maintaining clean, parseable formatting."
        },
        {
          q: "How can I stand out in 2025's job market?",
          a: "Focus on combining strong quantifiable achievements, demonstrated adaptability, and technical proficiency while maintaining authentic personal branding across all platforms."
        }
      ]
    },
    1: {
      title: "How AI is Revolutionizing Resume Writing: A Complete Guide for 2024",
      description: "Discover how artificial intelligence is transforming the way we create and optimize resumes. Learn expert tips for using AI to land your dream job in 2024.",
      date: "2024-01-08",
      author: "Sarah Johnson",
      authorRole: "AI Resume Expert",
      readTime: "8 min read",
      imageUrl: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
      sections: [
        {
          title: "The Evolution of Resume Writing",
          content: "Gone are the days of one-size-fits-all resumes. In 2024, AI-powered tools are revolutionizing how job seekers create and optimize their resumes. This transformation is making it easier than ever to craft targeted, compelling job applications that resonate with both automated tracking systems and human recruiters.",
          imageUrl: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
        },
        {
          title: "Key Benefits of AI Resume Optimization",
          content: "AI brings several game-changing advantages to resume writing:\n\n- Instant customization for specific job descriptions\n- ATS optimization for higher pass rates\n- Smart keyword integration\n- Real-time feedback and suggestions\n- Data-driven formatting decisions",
          imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
        },
        {
          title: "Best Practices for AI-Enhanced Resumes",
          content: "While AI can significantly improve your resume, it's important to follow these best practices:\n\n1. Start with a well-structured base resume\n2. Use industry-specific keywords naturally\n3. Maintain authenticity in your experience descriptions\n4. Review and personalize AI suggestions\n5. Test your resume against multiple ATS systems",
          imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
        }
      ],
      faq: [
        {
          q: "How effective is AI in resume writing?",
          a: "AI has shown to increase interview callback rates by up to 300% through optimized keyword usage and formatting that appeals to both ATS systems and human recruiters."
        },
        {
          q: "Is it ethical to use AI?",
          a: "Using AI tools for resume optimization is completely ethical and increasingly expected in today's job market. These tools help present your authentic experience in the most effective way."
        },
        {
          q: "Will AI replace human resume writers?",
          a: "AI is a powerful tool that enhances rather than replaces human input. The best results come from combining AI optimization with human creativity and judgment."
        }
      ]
    }
  };

  const post = blogPosts[id];

  if (!post) {
    return (
      <div className="pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900">Blog post not found</h1>
          <button 
            onClick={() => navigate('/blog')}
            className="mt-4 text-blue-600 hover:text-blue-800"
          >
            Back to blog
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{post.title} | AI Resume Pro</title>
        <meta name="description" content={post.description} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.description} />
        <meta property="og:image" content={post.imageUrl} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="keywords" content="AI resume, resume optimization, job application, career advancement, ATS optimization, 2024 resume tips" />
      </Helmet>

      <div className="pt-24 pb-16 bg-gray-50">
        <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <button 
            onClick={() => navigate('/blog')}
            className="mb-8 text-blue-600 hover:text-blue-800 flex items-center group"
          >
            <svg className="w-4 h-4 mr-1 transform group-hover:-translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to blog
          </button>

          {/* Hero Section */}
          <div className="relative overflow-hidden mb-12">
            <img 
              src={post.imageUrl} 
              alt={post.title}
              className="w-full h-96 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
            <div className="absolute bottom-0 p-8 text-white">
              <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
              <div className="flex items-center space-x-4 text-sm">
                <span>{post.author}</span>
                <span>•</span>
                <span>{post.authorRole}</span>
                <span>•</span>
                <span>{post.readTime}</span>
              </div>
            </div>
          </div>

          {/* Content Sections */}
          <div className="space-y-12">
            {post.sections.map((section, index) => (
              <section key={index} className="py-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">{section.title}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div className="prose prose-blue max-w-none">
                    {section.content.split('\n\n').map((paragraph, i) => (
                      paragraph.startsWith('- ') ? (
                        <ul key={i} className="list-disc pl-4 space-y-2 text-gray-600">
                          {paragraph.split('\n').map((item, j) => (
                            <li key={j}>{item.replace('- ', '')}</li>
                          ))}
                        </ul>
                      ) : paragraph.match(/^\d\./) ? (
                        <ol key={i} className="list-decimal pl-4 space-y-2 text-gray-600">
                          {paragraph.split('\n').map((item, j) => (
                            <li key={j}>{item.replace(/^\d\.\s/, '')}</li>
                          ))}
                        </ol>
                      ) : (
                        <p key={i} className="text-gray-600 leading-relaxed">
                          {paragraph}
                        </p>
                      )
                    ))}
                  </div>
                  <div className="order-first md:order-last">
                    <img 
                      src={section.imageUrl} 
                      alt={`Illustration for ${section.title}`}
                      className="rounded-xl shadow-lg hover:shadow-xl transition-shadow"
                    />
                  </div>
                </div>
              </section>
            ))}

            {/* FAQ Section */}
            <section className="py-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
              <div className="space-y-6">
                {post.faq.map((item, index) => (
                  <div key={index} className="border-b border-gray-200 pb-6 last:border-0">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.q}</h3>
                    <p className="text-gray-600">{item.a}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* CTA Section */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white text-center">
              <h3 className="text-3xl font-bold mb-4">Ready to Transform Your Resume?</h3>
              <p className="text-xl mb-8 opacity-90">
                Try our AI-powered resume optimization tool and increase your chances of landing your dream job.
              </p>
              <button 
                onClick={() => navigate('/signup')}
                className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-50 transition-colors duration-200 transform hover:-translate-y-1"
              >
                Get Started Now
              </button>
            </div>
          </div>
        </article>
      </div>
    </>
  );
}