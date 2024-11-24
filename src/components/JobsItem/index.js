import {Link} from 'react-router-dom'

import {FaStar} from 'react-icons/fa'
import {IoLocationSharp} from 'react-icons/io5'
import {MdWork} from 'react-icons/md'

import './index.css'

const JobsItem = props => {
  const {jobsDetails} = props
  const {
    title,
    id,
    packagePerAnnum,
    jobDescription,
    companyLogoUrl,
    employmentType,
    location,
    rating,
  } = jobsDetails
  return (
    <li className="jobs-item">
      <Link to={`/jobs/${id}`} className="link-el">
        <button type="button" className="jobs-item-btn">
          <div className="company-details-container">
            <img
              src={companyLogoUrl}
              alt="company logo"
              className="company-logo"
            />
            <div className="company-name-container">
              <h1 className="title">{title}</h1>
              <p className="rating">
                <FaStar className="star-icon" />
                {rating}
              </p>
            </div>
          </div>
          <div className="company-location-salary-container">
            <div className="location-container">
              <p className="location">
                <IoLocationSharp className="location-icon" />
                {location}
              </p>
              <p className="employment-type">
                <MdWork className="location-icon" />
                {employmentType}
              </p>
            </div>
            <p className="salary">{packagePerAnnum}</p>
          </div>
          <div className="description-container">
            <h1>Description</h1>
            <p className="description">{jobDescription}</p>
          </div>
        </button>
      </Link>
    </li>
  )
}

export default JobsItem
