import sql from "@/app/api/utils/sql";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");

  if (!q || q.length < 2) {
    return Response.json([]);
  }

  const query = `%${q}%`;

  try {
    const results = await sql`
      WITH search_results AS (
        -- Users / Providers / Schools
        SELECT 
          p.id::text, 
          p.full_name as title, 
          COALESCE(p.university, p.bio, 'User') as subtitle,
          p.avatar_url as image_url, 
          'profile' as type,
          p.account_type as subtype,
          p.created_at,
          jsonb_build_object(
             'id', p.id,
             'full_name', p.full_name,
             'avatar_url', p.avatar_url,
             'bio', p.bio,
             'university', p.university,
             'account_type', p.account_type,
             'role', p.account_type
          ) as details
        FROM profiles p
        WHERE p.full_name ILIKE ${query} 
           OR p.bio ILIKE ${query} 
           OR p.university ILIKE ${query}

        UNION ALL

        -- Services
        SELECT 
          s.id::text, 
          s.title, 
          COALESCE(s.description, 'Service') as subtitle, 
          s.image_url, 
          'service' as type,
          s.category as subtype,
          s.created_at,
          jsonb_build_object(
            'id', s.id,
            'title', s.title,
            'description', s.description,
            'price', s.price,
            'currency', s.currency,
            'image_url', s.image_url,
            'rating', s.rating,
            'reviews_count', s.reviews_count,
            'user_name', pr.full_name,
            'user_avatar', pr.avatar_url,
            'profile_id', s.profile_id,
            'providerName', pr.full_name
          ) as details
        FROM services s
        LEFT JOIN profiles pr ON s.profile_id = pr.id
        WHERE s.title ILIKE ${query} 
           OR s.description ILIKE ${query}

        UNION ALL

        -- Posts
        SELECT 
          p.id::text, 
          SUBSTRING(p.content, 1, 60) as title, 
          pr.full_name as subtitle, 
          p.image_url, 
          'post' as type,
          'social' as subtype,
          p.created_at,
           jsonb_build_object(
            'id', p.id,
            'content', p.content,
            'image_url', p.image_url,
            'video_url', p.video_url,
            'audio_url', p.audio_url,
            'created_at', p.created_at,
            'likes_count', p.likes_count,
            'comments_count', p.comments_count,
            'user_name', pr.full_name,
            'authorAvatar', pr.avatar_url,
            'user_university', pr.university,
            'profile_id', pr.id,
            'authorName', pr.full_name
          ) as details
        FROM posts p
        JOIN profiles pr ON p.profile_id = pr.id
        WHERE p.content ILIKE ${query}

        UNION ALL
        
        -- Categories (Disciplines)
        SELECT
          c.id::text,
          c.name as title,
          COALESCE(c.description, 'Category') as subtitle,
          c.icon as image_url, 
          'category' as type,
          'marketplace' as subtype,
          c.created_at,
          jsonb_build_object(
            'id', c.id,
            'name', c.name,
            'description', c.description,
            'icon', c.icon
          ) as details
        FROM marketplace_categories c
        WHERE c.name ILIKE ${query}

        UNION ALL

        -- Topics (Hashtags)
        SELECT
          h.id::text,
          '#' || h.tag as title,
          'Topic' as subtitle,
          NULL as image_url,
          'topic' as type,
          'hashtag' as subtype,
          h.created_at,
          jsonb_build_object(
            'id', h.id,
            'tag', h.tag
          ) as details
        FROM hashtags h
        WHERE h.tag ILIKE ${query}
      )
      SELECT * FROM search_results
      ORDER BY 
        CASE 
          WHEN title ILIKE ${q} THEN 1 
          WHEN title ILIKE ${query} THEN 2 
          ELSE 3 
        END,
        created_at DESC
      LIMIT 50
    `;

    return Response.json(results);
  } catch (error) {
    console.error("Search error:", error);
    return Response.json({ error: "Search failed" }, { status: 500 });
  }
}
