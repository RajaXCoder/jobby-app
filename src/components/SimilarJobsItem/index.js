import {FaStar} from 'react-icons/fa'
import {IoLocationSharp} from 'react-icons/io5'
import {MdWork} from 'react-icons/md'

import './index.css'

const SimilarJobsItem = props => {
  const {similarJobsDetails} = props
  const {
    companyLogoUrl,
    title,
    rating,
    employmentType,
    location,
    jobDescription,
  } = similarJobsDetails
  return (
    <li className="similar-jobs-item">
      <img
        src={companyLogoUrl}
        alt="similar job company logo"
        className="company-logo"
      />
      <div className="company-name-container">
        <h1 className="title">{title}</h1>
        <p className="rating">
          <FaStar className="star-icon" />
          {rating}
        </p>
      </div>
      <div className="description-container">
        <h1>Description</h1>
        <p className="description">{jobDescription}</p>
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
      </div>
    </li>
  )
}

export default SimilarJobsItem
