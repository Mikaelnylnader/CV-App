import { supabase } from '../lib/supabaseClient';

export const blogService = {
  async createOrUpdatePost(postData) {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error('Not authenticated');

      const { data: post, error } = await supabase
        .from('blog_posts')
        .upsert({
          title: postData.title,
          content: postData.content,
          description: postData.description,
          excerpt: postData.excerpt,
          author: postData.author,
          author_role: postData.author_role,
          image_url: postData.image_url,
          read_time: postData.read_time,
          published: postData.published || false,
          slug: postData.slug,
          google_doc_id: postData.google_doc_id,
          last_synced_at: new Date().toISOString()
        }, {
          onConflict: 'google_doc_id',
          returning: 'minimal'
        });

      if (error) throw error;
      return post;
    } catch (error) {
      console.error('Error creating/updating blog post:', error);
      throw error;
    }
  },

  async getPostByGoogleDocId(googleDocId) {
    try {
      const { data: post, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('google_doc_id', googleDocId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return post;
    } catch (error) {
      console.error('Error fetching blog post:', error);
      throw error;
    }
  }
};