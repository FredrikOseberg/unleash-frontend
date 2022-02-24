import FormTemplate from 'component/common/FormTemplate/FormTemplate';
import { UpdateButton } from 'component/common/UpdateButton/UpdateButton';
import useEnvironmentApi from 'hooks/api/actions/useEnvironmentApi/useEnvironmentApi';
import useEnvironment from 'hooks/api/getters/useEnvironment/useEnvironment';
import useProjectRolePermissions from 'hooks/api/getters/useProjectRolePermissions/useProjectRolePermissions';
import useUiConfig from 'hooks/api/getters/useUiConfig/useUiConfig';
import useToast from 'hooks/useToast';
import { useHistory, useParams } from 'react-router-dom';
import { ADMIN } from '../../providers/AccessProvider/permissions';
import EnvironmentForm from '../EnvironmentForm/EnvironmentForm';
import useEnvironmentForm from '../hooks/useEnvironmentForm';

const EditEnvironment = () => {
    const { uiConfig } = useUiConfig();
    const { setToastData, setToastApiError } = useToast();

    const { id } = useParams<{ id: string }>();
    const { environment } = useEnvironment(id);
    const { updateEnvironment } = useEnvironmentApi();

    const history = useHistory();
    const { name, type, setName, setType, errors, clearErrors } =
        useEnvironmentForm(environment.name, environment.type);
    const { refetch } = useProjectRolePermissions();

    const editPayload = () => {
        return {
            type,
            sortOrder: environment.sortOrder,
        };
    };

    const formatApiCode = () => {
        return `curl --location --request PUT '${
            uiConfig.unleashUrl
        }/api/admin/environments/update/${id}' \\
--header 'Authorization: INSERT_API_KEY' \\
--header 'Content-Type: application/json' \\
--data-raw '${JSON.stringify(editPayload(), undefined, 2)}'`;
    };

    const handleSubmit = async (e: Event) => {
        e.preventDefault();
        try {
            await updateEnvironment(id, editPayload());
            refetch();
            history.push('/environments');
            setToastData({
                type: 'success',
                title: 'Successfully updated environment.',
            });
        } catch (e: any) {
            setToastApiError(e.toString());
        }
    };

    const handleCancel = () => {
        history.goBack();
    };

    return (
        <FormTemplate
            title="Edit environment"
            description="Environments allow you to manage your 
            product lifecycle from local development
            through production. Your projects and
            feature toggles are accessible in all your
            environments, but they can take different
            configurations per environment. This means
            that you can enable a feature toggle in a
            development or test environment without
            enabling the feature toggle in the
            production environment."
            documentationLink="https://docs.getunleash.io/user_guide/environments"
            formatApiCode={formatApiCode}
        >
            <EnvironmentForm
                handleSubmit={handleSubmit}
                handleCancel={handleCancel}
                name={name}
                type={type}
                setName={setName}
                setType={setType}
                mode="Edit"
                errors={errors}
                clearErrors={clearErrors}
            >
                <UpdateButton permission={ADMIN} />
            </EnvironmentForm>
        </FormTemplate>
    );
};

export default EditEnvironment;
