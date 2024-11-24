import {Component} from 'react'
import {IoSearchOutline} from 'react-icons/io5'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'

import Header from '../Header'
import JobsFilter from '../JobsFilter'
import JobsItem from '../JobsItem'

import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const status = {
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

// const employmentTypeList = []
class Jobs extends Component {
  state = {
    jobsList: [],
    apiStatus: status.inProgress,
    searchInput: '',
    employment: [],
    annumSalary: '',
  }

  componentDidMount() {
    this.getJobs()
  }

  getJobs = async () => {
    const {searchInput, employment, annumSalary} = this.state

    const formattedEmployment = employment.join(',')

    this.setState({apiStatus: status.inProgress})

    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const apiUrl = `https://apis.ccbp.in/jobs?employment_type=${formattedEmployment}&minimum_package=${annumSalary}&search=${searchInput}`

    const response = await fetch(apiUrl, options)
    const data = await response.json()

    if (response.ok) {
      const formattedJobData = data.jobs.map(each => ({
        companyLogoUrl: each.company_logo_url,
        employmentType: each.employment_type,
        id: each.id,
        jobDescription: each.job_description,
        location: each.location,
        packagePerAnnum: each.package_per_annum,
        rating: each.rating,
        title: each.title,
      }))

      this.setState({jobsList: formattedJobData, apiStatus: status.success})
    } else {
      this.setState({apiStatus: status.failure})
    }
  }

  onChangeSearch = event => {
    this.setState({searchInput: event.target.value})
  }

  enterSearch = () => {
    this.getJobs()
  }

  onClickEmploymentType = id => {
    const {employment} = this.state
    // console.log(employment)

    const inEmployemtId = employment.some(each => each === id)

    if (inEmployemtId) {
      this.setState(
        prevState => ({
          employment: [...prevState.employment.filter(eachId => eachId !== id)],
        }),
        this.getJobs,
      )
    } else {
      this.setState(
        prevState => ({employment: [...prevState.employment, id]}),
        this.getJobs,
      )
    }
    // console.log(formattedEmployment)

    // this.setState(
    //   prevState => ({
    //     employment: prevState.employment.filter(each => {
    //       if (each === id) {
    //         return each
    //       }
    //       return [...each, id]
    //     }),
    //   }),
    //   this.getJobs,
  }

  onChangeAnnumSalary = id => {
    this.setState({annumSalary: id}, this.getJobs)
  }

  renderJobsContainer = () => {
    const {jobsList} = this.state
    if (jobsList.length <= 0) {
      return (
        <div className="failure-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
            alt="no jobs"
            className="failure-iamge"
          />
          <h1>NO Jobs Found</h1>
          <p>We could not find any jobs. Try other filters</p>
        </div>
      )
    }

    return (
      <ul className="jobsList-contianer">
        {jobsList.map(each => (
          <JobsItem key={each.id} jobsDetails={each} />
        ))}
      </ul>
    )
  }

  renderLoader = () => (
    <div className="jobs-loader-container">
      <Loader type="ThreeDots" color="#fff" height="50" width="50" />
    </div>
  )

  renderFailureView = () => {
    const onRetry = () => {
      this.getJobs()
    }

    return (
      <div className="failure-container">
        <img
          src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
          alt="failure view"
          className="failure-iamge"
        />
        <h1>Oops! Something Went Wrong</h1>
        <p>We cannot seem to find the page you are looking for.</p>
        <button type="button" onClick={onRetry} className="retry-btn">
          Retry
        </button>
      </div>
    )
  }

  renderJobStatus = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case status.success:
        return this.renderJobsContainer()
      case status.inProgress:
        return this.renderLoader()
      case status.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    const {searchInput} = this.state

    return (
      <>
        <Header />
        <div className="jobs-container">
          <JobsFilter
            salaryRangesList={salaryRangesList}
            employmentTypesList={employmentTypesList}
            onClickEmploymentType={this.onClickEmploymentType}
            onChangeAnnumSalary={this.onChangeAnnumSalary}
          />

          <div className="jobs-list-container">
            <div className="search-container">
              <input
                type="search"
                className="search-input"
                value={searchInput}
                onChange={this.onChangeSearch}
              />
              <button
                data-testid="searchButton"
                type="button"
                onClick={this.enterSearch}
              >
                <IoSearchOutline />
              </button>
            </div>
            {this.renderJobStatus()}
          </div>
        </div>
      </>
    )
  }
}
export default Jobs
