import React from "react"
import { StaticQuery, Link, graphql } from "gatsby"

const Contents = () => {
  return (
    <StaticQuery
      query={graphql`
        query ContentsQuery {
          site {
            siteMetadata {
              title
            }
          }
          allMarkdownRemark(
            sort: { fields: [frontmatter___date], order: DESC }
          ) {
            nodes {
              excerpt
              fields {
                slug
              }
              frontmatter {
                date(formatString: "MMMM DD, YYYY")
                title
                description
              }
            }
          }
        }
      `}
      render={data => (
        <ol style={{ listStyle: `none` }}>
          {data.allMarkdownRemark.nodes.map(post => {
            const title = post.frontmatter.title || post.fields.slug

            return (
              <li key={post.fields.slug}>
                <article
                  className="post-list-item"
                  itemScope
                  itemType="http://schema.org/Article"
                >
                  <header>
                    <h2>
                      <Link to={post.fields.slug} itemProp="url">
                        <span itemProp="headline">{title}</span>
                      </Link>
                    </h2>
                    <small>{post.frontmatter.date}</small>
                  </header>
                  <section>
                    <p
                      dangerouslySetInnerHTML={{
                        __html: post.frontmatter.description || post.excerpt,
                      }}
                      itemProp="description"
                    />
                  </section>
                </article>
              </li>
            )
          })}
        </ol>
      )}
    />
  )
}

export default Contents
