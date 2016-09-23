import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import update from 'react-addons-update'
import _ from 'lodash'
import ProjectInfo from '../../../components/ProjectInfo/ProjectInfo'
import LinksMenu from '../../../components/LinksMenu/LinksMenu'
import FooterV2 from '../../../components/FooterV2/FooterV2'
import TeamManagementContainer from './TeamManagementContainer'
import { updateProject, deleteProject } from '../../actions/project'
import { PROJECT_ROLE_OWNER, PROJECT_ROLE_COPILOT, PROJECT_ROLE_MANAGER,
   DIRECT_PROJECT_URL/*, SALESFORCE_PROJECT_LEAD_LINK*/ } from '../../../config/constants'

class ProjectInfoContainer extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      duration: {
        percent: 0,
        text: 'Complete specification to get estimate'
      },
      budget: {
        percent: 80,
        text: '$1000 remaining'
      }
    }
    this.onChangeStatus = this.onChangeStatus.bind(this)
    this.onDeleteProject = this.onDeleteProject.bind(this)
    this.onAddNewLink = this.onAddNewLink.bind(this)
    this.onDeleteLink = this.onDeleteLink.bind(this)
  }

  onChangeStatus(status) {
    this.props.updateProject(this.props.project.id, {status})
  }

  onAddNewLink(link) {
    const { updateProject, project } = this.props
    updateProject(project.id, {
      bookmarks: update(project.bookmarks || [], { $push: [link] })
    })
  }

  onDeleteLink(idx) {
    const { updateProject, project } = this.props
    updateProject(project.id, {
      bookmarks: update(project.bookmarks, { $splice: [[idx, 1]] })
    })
  }

  onDeleteProject() {
    const { router, deleteProject, project } = this.props
    deleteProject(project.id)
    // navigate to project list view
    router.push('/projects')
  }

  render() {
    const {duration, budget } = this.state
    const { project, currentMemberRole } = this.props

    let directLinks = null
    // check if direct links need to be added
    const isMemberOrCopilot = _.indexOf([PROJECT_ROLE_COPILOT, PROJECT_ROLE_MANAGER], currentMemberRole) > -1
    if (isMemberOrCopilot) {
      directLinks = []
      if (project.directProjectId) {
        directLinks.push({name: 'Project in Topcoder Direct', href: `${DIRECT_PROJECT_URL}${project.directProjectId}`})
      }
      // TODO waiting on @mdesiderio for salesforce link info
      // directLinks.push({name: 'Salesforce Lead', href: `${SALESFORCE_PROJECT_LEAD_LINK}`})
    }

    const canDeleteProject = currentMemberRole === PROJECT_ROLE_OWNER
      && project.status === 'draft'
    return (
      <div>
        <ProjectInfo
          canDeleteProject={canDeleteProject}
          onDeleteProject={this.onDeleteProject}
          directLinks={directLinks}
          currentMemberRole={currentMemberRole}
          type={project.type}
          devices={project.details.devices || []}
          status={project.status} onChangeStatus={this.onChangeStatus}
          duration={duration}
          budget={budget}
        />
        <LinksMenu
          links={project.bookmarks || []}
          canDelete={!!currentMemberRole}
          onAddNewLink={this.onAddNewLink}
          onDelete={this.onDeleteLink}
        />
      <TeamManagementContainer projectId={project.id} members={project.members}/>
        <FooterV2 />
      </div>
    )
  }
}

ProjectInfoContainer.PropTypes = {
  currentMemberRole: PropTypes.string,
  project: PropTypes.object.isRequired
}

const mapDispatchToProps = { updateProject, deleteProject }

export default withRouter(connect(null, mapDispatchToProps)(ProjectInfoContainer))
