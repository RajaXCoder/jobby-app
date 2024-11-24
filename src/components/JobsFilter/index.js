import {Component} from 'react'

import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'

import './index.css'

const status = {
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

const Category = props => {
  const {categoryDetails, onClickEmploymentType} = props
  const {employmentTypeId, label} = categoryDetails

  const onClickEmployment = () => {
    onClickEmploymentType(employmentTypeId)
  }
  return (
    <li className="checkbox-item">
      <button type="button" className="filter-btn" onClick={onClickEmployment}>
        <input name="employment" type="checkbox" id={employmentTypeId} />
        <label htmlFor={employmentTypeId}>{label}</label>
      </button>
    </li>
  )
}

const SalaryItem = props => {
  const {salaryDetais, onChangeAnnumSalary} = props

  const {label, salaryRangeId} = salaryDetais

  const onClickSalary = () => {
    onChangeAnnumSalary(salaryRangeId)
  }

  return (
    <li className="checkbox-item">
      <button type="button" className="filter-btn" onClick={onClickSalary}>
        <input name="salary" type="radio" id={salaryRangeId} />
        <label htmlFor={salaryRangeId}>{label}</label>
      </button>
    </li>
  )
}

class JobsFilter extends Component {
  state = {
    profile: [],
    isProfileStatus: status.inProgress,
  }

  componentDidMount() {
    this.getProfile()
  }

  getProfile = async () => {
    this.setState({isProfileStatus: status.inProgress})

    const jwtToken = Cookies.get('jwt_token')

    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      methed: 'GET',
    }

    const apiUrl = 'https://apis.ccbp.in/profile'
    const response = await fetch(apiUrl, options)
    const data = await response.json()
    const {profile_details: profileDetails} = data

    if (response.ok) {
      const formattedProfileData = {
        name: profileDetails.name,
        profileUrl: profileDetails.profile_image_url,
        shortBio: profileDetails.short_bio,
      }
      this.setState({
        profile: formattedProfileData,
        isProfileStatus: status.success,
      })
    } else {
      this.setState({isProfileStatus: status.failure})
    }
  }

  renderContainer = () => {
    const {profile} = this.state
    const {profileUrl, name, shortBio} = profile
    return (
      <div className="profile-user-container">
        <img src={profileUrl} alt="profile" className="profile-image" />
        <h1>{name}</h1>
        <p>{shortBio}</p>
      </div>
    )
  }

  renderLoader = () => (
    <div className="profile-loader-container">
      <Loader type="ThreeDots" color="#fff" height="50" width="50" />
    </div>
  )

  renderFailureView = () => {
    const onRetry = () => {
      this.getProfile()
    }

    return (
      <div className="failure-profile-container">
        <button type="button" onClick={onRetry} className="retry-btn">
          Retry
        </button>
      </div>
    )
  }

  renderProfileStatus = () => {
    const {isProfileStatus} = this.state

    switch (isProfileStatus) {
      case status.success:
        return this.renderContainer()
      case status.inProgress:
        return this.renderLoader()
      case status.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    const {
      salaryRangesList,
      employmentTypesList,
      onClickEmploymentType,
      onChangeAnnumSalary,
    } = this.props

    return (
      <div className="jobs-filter-container">
        {this.renderProfileStatus()}

        <div className="type-of-jobs-container">
          <h1 className="category-heading">Types of Employee</h1>
          <ul className="employment-list-container">
            {employmentTypesList.map(each => (
              <Category
                onClickEmploymentType={onClickEmploymentType}
                categoryDetails={each}
                key={each.employmentTypeId}
              />
            ))}
          </ul>
          <h1 className="category-heading">Types of Salary</h1>
          <ul className="salary-list-container">
            {salaryRangesList.map(each => (
              <SalaryItem
                key={each.salaryRangeId}
                salaryDetais={each}
                onChangeAnnumSalary={onChangeAnnumSalary}
              />
            ))}
          </ul>
        </div>
      </div>
    )
  }
}

export default JobsFilter
