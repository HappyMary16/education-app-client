import React, {useState} from 'react';
import {useSelector} from 'react-redux';
import i18n from '../../../locales/i18n';
import Select from 'react-select';
import {selectorColors} from '../../../styles/styles';
import {Button, Col} from 'react-bootstrap';
import {SubjectFiles} from './components/SubjectFiles';
import {EmptyPage} from '../../common/components/EmptyPage';
import {ADD_FILE, FILES_PAGE} from '../../../constants/links';
import {useNavigate} from "react-router-dom";
import {getId} from "../../../services/authService";
import {skipToken} from "@reduxjs/toolkit/query";
import {useFetchGroupsQuery} from "../../../store/group/groupApiSlice";
import {useFetchSubjectsByUserIdQuery} from "../../../store/subject/subjectApiSlice";
import {useAddAccessToFilesMutation, useFetchFilesQuery} from "../../../store/file/fileApiSlice";
import {selectApiLoading} from "../../../App";

let selectedGroups = [];
let selectedFiles = [];

export default function ShareFiles() {

  const navigate = useNavigate();
  const [addAccessToFiles] = useAddAccessToFilesMutation();

  const {data: subjects} = useFetchSubjectsByUserIdQuery(getId() ?? skipToken);
  const {data: files} = useFetchFilesQuery(getId() ?? skipToken);
  const {data: groups} = useFetchGroupsQuery();
  const isFetching = useSelector(selectApiLoading);

  const [subjectId, setSubjectId] = useState();

  function submit() {
    addAccessToFiles({
        fileIds: selectedFiles,
        groupIds: selectedGroups.map(group => group.value)
      }
    )

    selectedFiles = [];
    selectedGroups = [];
    navigate(FILES_PAGE);
  }

  function handleChange(value, file) {
    if (selectedFiles.includes(file)) {
      selectedFiles.filter(f => f !== file);
    } else {
      selectedFiles.push(file);
    }
  }

  function handleGroupChange(value) {
    selectedGroups = value;
  }

  return (
    <div>
      <EmptyPage
        message={i18n.t("you_do_not_have_any_file")}
        href={ADD_FILE}
        linkText={i18n.t("add_files_page")}
        list={subjectId ? files : subjects}
        isFetching={isFetching}
      />

      {subjects?.length > 0 && (
        <div>
          <Select
            className={"selector"}
            theme={selectorColors}
            onChange={opinion => setSubjectId(opinion.value)}
            options={subjects.map(s => {
              return {
                value: s.id,
                label: s.name
              };
            })}
            placeholder={i18n.t("subject")}
          />
          <SubjectFiles
            lectures={files?.filter(file => file.fileType === 'LECTURE') ?? []}
            tasks={files?.filter(file => file.fileType === 'TASK') ?? []}
            subjectId={subjectId}
            handleChoose={handleChange}
          />
          <Select
            className={"selector"}
            placeholder={i18n.t("groups")}
            theme={selectorColors}
            isMulti
            onChange={handleGroupChange}
            options={groups}
          />

          <Col
            xs={12}
            md={{offset: 9, span: 3}}
            lg={{offset: 9, span: 3}}
            xl={{offset: 10, span: 2}}
          >
            <Button
              block
              type={"submit"}
              variant={"purple"}
              onClick={submit}
            >
              {i18n.t("upload")}
            </Button>
          </Col>
        </div>
      )}
    </div>
  );
}
