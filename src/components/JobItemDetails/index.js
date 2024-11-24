import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'

import {FaStar, FaExternalLinkAlt} from 'react-icons/fa'
import {IoLocationSharp} from 'react-icons/io5'
import {MdWork} from 'react-icons/md'

import SimilarJobsItem from '../SimilarJobsItem'

import './index.css'

const status = {
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class JobItemDetails extends Component {
  state = {
    jobDetailsList: {},
    apiStatus: status.inProgress,
  }

  componentDidMount() {
    this.getJobsItemDetails()
  }

  formattedJobData = each => ({
    companyLogoUrl: each.company_logo_url,
    employmentType: each.employment_type,
    companyWebsiteUrl: each.company_website_url,
    id: each.id,
    jobDescription: each.job_description,
    location: each.location,
    packagePerAnnum: each.package_per_annum,
    rating: each.rating,
    title: each.title,
  })

  getJobsItemDetails = async () => {
    this.setState({apiStatus: status.inProgress})

    const {match} = this.props
    const {id} = match.params

    const apiUrl = `https://apis.ccbp.in/jobs/${id}`

    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch(apiUrl, options)
    const data = await response.json()
    console.log(data)
    if (response.ok) {
      // const formattedskills = skills.map(eachItem => ({
      //   name: eachItem.name,
      //   imageUrl: eachItem.image_url,
      // }))
      const lifeAtCompany = {
        description: data.job_details.life_at_company.description,
        imageUrl: data.job_details.life_at_company.image_url,
      }

      const skills = data.job_details.skills.map(eachItem => ({
        name: eachItem.name,
        imageUrl: eachItem.image_url,
      }))

      const jobDetails = {
        ...this.formattedJobData(data.job_details),
        lifeAtCompany,
        skills,
      }
      const similarJobs = data.similar_jobs.map(eachItem =>
        this.formattedJobData(eachItem),
      )
      this.setState({
        jobDetailsList: {jobDetails, similarJobs},
        apiStatus: status.success,
      })
    } else {
      this.setState({apiStatus: status.failure})
    }
  }

  renderLoader = () => (
    <div className='jobs-details-loader-container' data-testid='loader'>
      <Loader type='ThreeDots' color='#fff' height='50' width='50' />
    </div>
  )

  renderJobDetailsContainer = () => {
    const {jobDetailsList} = this.state
    const {jobDetails, similarJobs} = jobDetailsList
    const {
      companyLogoUrl,
      companyWebsiteUrl,
      title,
      rating,
      employmentType,
      location,
      packagePerAnnum,
      jobDescription,
      skills,
      lifeAtCompany,
    } = jobDetails
    return (
      <div className='jobs-details-container'>
        <div className='job-item-details-container'>
          <div className='company-details-container'>
            <img
              src={companyLogoUrl}
              alt='job details company logo'
              className='company-logo'
            />
            <div className='company-name-container'>
              <h1 className='title'>{title}</h1>
              <p className='rating'>
                <FaStar className='star-icon' />
                {rating}
              </p>
            </div>
          </div>
          <div className='company-location-salary-container'>
            <div className='location-container'>
              <p className='location'>
                <IoLocationSharp className='location-icon' />
                {location}
              </p>
              <p className='employment-type'>
                <MdWork className='location-icon' />
                {employmentType}
              </p>
            </div>
            <p className='salary'>{packagePerAnnum}</p>
          </div>
          <div className='description-container'>
            <div className='descrip-website-link-container'>
              <h1>Description</h1>
              <a
                href={companyWebsiteUrl}
                target='_black'
                className='website-link-anchor-text'
              >
                Visit <FaExternalLinkAlt className='visit-icon' />
              </a>
            </div>
            <p className='description'>{jobDescription}</p>
          </div>
          <h1 className='skills-heading'>Skills</h1>
          <ul className='skills-container'>
            {skills.map(each => (
              <li className='skills-items' key={each.name}>
                <img
                  src={each.imageUrl}
                  alt={each.name}
                  className='skills-image'
                />
                <p>{each.name}</p>
              </li>
            ))}
          </ul>
          <h1>Life at Company</h1>
          <div className='life-at-company-container'>
            <p>{lifeAtCompany.description}</p>
            <img
              src={lifeAtCompany.imageUrl}
              alt='life at company'
              className='life-at-company-image'
            />
          </div>
        </div>
        <h1 className='similar-jobs-heading'>Similar Jobs</h1>
        <ul className='similar-jobs-list-container'>
          {similarJobs.map(each => (
            <SimilarJobsItem key={each.id} similarJobsDetails={each} />
          ))}
        </ul>
      </div>
    )
  }

  renderFailureView = () => {
    const onRetry = () => {
      this.getJobsItemDetails()
    }

    return (
      <div className='failure-container'>
        <img
          src='https://assets.ccbp.in/frontend/react-js/failure-img.png'
          alt='failure view'
          className='failure-iamge'
        />
        <h1>Oops! Something Went Wrong</h1>
        <p>We cannot seem to find the page you are looking for</p>
        <button type='button' onClick={onRetry} className='retry-btn'>
          Retry
        </button>
      </div>
    )
  }

  renderStatus = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case status.success:
        return this.renderJobDetailsContainer()
      case status.inProgress:
        return this.renderLoader()
      case status.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    return <>{this.renderStatus()}</>
  }
}

export default JobItemDetails
