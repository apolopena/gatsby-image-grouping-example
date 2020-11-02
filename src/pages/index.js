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

  const sortImages = (obj) => {
    const numR = new RegExp(/(\d+)/)
    const ascending = (a, b) => {
      const _a = Number(a.fileName.match(numR)[0])
      const _b = Number(b.fileName.match(numR)[0])
      if (_a < _b) return -1
      return (_a > _b) ? 1 : 0
    }
    let result = {}
    for (const key in obj) {
      let val = [...obj[key]]
      result[key] = val.sort(ascending)
    }
    return result
  }

  const unsortedPeople = data.allFile.edges.reduce((acc, val, i) => {
    const fluid = val.node.childImageSharp.fluid
    const person = getPersonName(fluid.originalName)
    const result = {fileName: fluid.originalName, fluid}
    
    acc[person]
      ? acc[person].push(result)
      : acc[person] = [result]

    return { ...acc }
  }, {})

  const people = sortImages(unsortedPeople)
  const layout = []
  
  for (const value of Object.values(people)) {
    value.forEach((item, i, arr) => {
      const name = getPersonName(item.fileName)
      if (i === 0) layout.push(<label key={name}><br /><h1>{name}</h1></label>)
      layout.push(
        <Img 
          key={item.fileName}
          fluid={item.fluid} 
          style={{
            border: '1px solid indianred',
            marginBottom: '.2rem'
          }}>
        </Img>
      )
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

