import React from "react"
import { Link } from "gatsby"
import { useStaticQuery, graphql } from "gatsby"
import Layout from "../components/layout"
import Img from "gatsby-image"
import SEO from "../components/seo"

const IndexPage = () => {
  const data = useStaticQuery(graphql`
    query PeopleImages {
      allFile(filter: {extension: {regex: "/(jpg)|(jpeg)|(png)/"}, dir: {regex: "/images/people/"}}) {
        edges {
          node {
            id
            childImageSharp {
              fluid(maxWidth: 300, quality: 90) {
                base64
                aspectRatio
                src
                srcSet
                sizes
                originalName
              }
            }
          }
        }
      }
    }
  `)

  const getPersonName = (fileName) => fileName.split('.')[0].replace(/[0-9]/g, '')

  const people = data.allFile.edges.reduce((acc, val, i) => {
    const fluid = val.node.childImageSharp.fluid
    const person = getPersonName(fluid.originalName)
    const data = {fileName: fluid.originalName, fluid}
    if (!acc[person]) {
      acc[person] = [data]
    } else {
      acc[person].push(data)
    }
    return {...acc}
  }, {})

  const layout = []

  for (const value of Object.values(people)) {
    value.forEach((item, i, arr) => {
      const name = getPersonName(item.fileName)

      if (i === 0) layout.push(<label key={name}><br /><h1>{name}</h1></label>)

      layout.push(<Img key={item.fileName} fluid={item.fluid}></Img>)
    })
  }

  return (
    <Layout>
      <SEO title="Example" />
      <h2><p><code style={{fontSize:26}}>gatsby-image</code> grouping example</p></h2>
      <h4>An example of how to query nested directories of gatsby images and display on the page.</h4>
      <div style={{ maxWidth: `300px`, marginBottom: `1.45rem` }}>
        {
          layout.map(item => item)
        }
      </div>
      <Link to="/page-2/">Go to page 2</Link> <br />
      <Link to="/using-typescript/">Go to "Using TypeScript"</Link>
    </Layout>
  )
}

export default IndexPage

