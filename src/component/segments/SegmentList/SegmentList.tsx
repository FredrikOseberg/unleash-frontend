import { useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material';
import usePagination from 'hooks/usePagination';
import { CREATE_SEGMENT } from 'component/providers/AccessProvider/permissions';
import PaginateUI from 'component/common/PaginateUI/PaginateUI';
import { SegmentListItem } from './SegmentListItem/SegmentListItem';
import { ISegment } from 'interfaces/segment';
import { useStyles } from './SegmentList.styles';
import { useSegments } from 'hooks/api/getters/useSegments/useSegments';
import { useSegmentsApi } from 'hooks/api/actions/useSegmentsApi/useSegmentsApi';
import useToast from 'hooks/useToast';
import { formatUnknownError } from 'utils/formatUnknownError';
import { Link, useNavigate } from 'react-router-dom';
import { ConditionallyRender } from 'component/common/ConditionallyRender/ConditionallyRender';
import { PageHeader } from 'component/common/PageHeader/PageHeader';
import { PageContent } from 'component/common/PageContent/PageContent';
import PermissionButton from 'component/common/PermissionButton/PermissionButton';
import { SegmentDelete } from '../SegmentDelete/SegmentDelete';
import { SegmentDocsWarning } from 'component/segments/SegmentDocs/SegmentDocs';
import { NAVIGATE_TO_CREATE_SEGMENT } from 'utils/testIds';

export const SegmentsList = () => {
    const navigate = useNavigate();
    const { segments = [], refetchSegments } = useSegments();
    const { deleteSegment } = useSegmentsApi();
    const { page, pages, nextPage, prevPage, setPageIndex, pageIndex } =
        usePagination(segments, 10);
    const [currentSegment, setCurrentSegment] = useState<ISegment>();
    const [delDialog, setDelDialog] = useState(false);
    const { setToastData, setToastApiError } = useToast();

    const { classes: styles } = useStyles();

    const onDeleteSegment = async () => {
        if (!currentSegment?.id) return;
        try {
            await deleteSegment(currentSegment?.id);
            await refetchSegments();
            setToastData({
                type: 'success',
                title: 'Successfully deleted segment',
            });
        } catch (error: unknown) {
            setToastApiError(formatUnknownError(error));
        }
        setDelDialog(false);
    };

    const renderSegments = () => {
        return page.map((segment: ISegment) => {
            return (
                <SegmentListItem
                    key={segment.id}
                    id={segment.id}
                    name={segment.name}
                    description={segment.description}
                    createdAt={segment.createdAt}
                    createdBy={segment.createdBy}
                    setCurrentSegment={setCurrentSegment}
                    setDelDialog={setDelDialog}
                />
            );
        });
    };

    const renderNoSegments = () => {
        return (
            <div className={styles.empty}>
                <Typography className={styles.title}>
                    No segments yet!
                </Typography>
                <p className={styles.subtitle}>
                    Segment makes it easy for you to define who should be
                    exposed to your feature. The segment is often a collection
                    of constraints and can be reused.
                </p>
                <Link to="/segments/create" className={styles.paramButton}>
                    Create your first segment
                </Link>
            </div>
        );
    };

    return (
        <PageContent
            header={
                <PageHeader
                    title="Segments"
                    actions={
                        <PermissionButton
                            onClick={() => navigate('/segments/create')}
                            permission={CREATE_SEGMENT}
                            data-testid={NAVIGATE_TO_CREATE_SEGMENT}
                        >
                            New Segment
                        </PermissionButton>
                    }
                />
            }
        >
            <div className={styles.docs}>
                <SegmentDocsWarning />
            </div>
            <Table>
                <TableHead>
                    <TableRow className={styles.tableRow}>
                        <TableCell
                            className={styles.firstHeader}
                            classes={{ root: styles.cell }}
                        >
                            Name
                        </TableCell>
                        <TableCell
                            classes={{ root: styles.cell }}
                            className={styles.hideSM}
                        >
                            Description
                        </TableCell>
                        <TableCell
                            classes={{ root: styles.cell }}
                            className={styles.hideXS}
                        >
                            Created on
                        </TableCell>
                        <TableCell
                            classes={{ root: styles.cell }}
                            className={styles.hideXS}
                        >
                            Created By
                        </TableCell>
                        <TableCell
                            align="right"
                            classes={{ root: styles.cell }}
                            className={styles.lastHeader}
                        >
                            Action
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    <ConditionallyRender
                        condition={segments.length > 0}
                        show={renderSegments()}
                    />
                </TableBody>
            </Table>
            <PaginateUI
                pages={pages}
                pageIndex={pageIndex}
                setPageIndex={setPageIndex}
                nextPage={nextPage}
                prevPage={prevPage}
                style={{ position: 'static', marginTop: '2rem' }}
            />
            <ConditionallyRender
                condition={segments.length === 0}
                show={renderNoSegments()}
            />
            <ConditionallyRender
                condition={Boolean(currentSegment)}
                show={() => (
                    <SegmentDelete
                        segment={currentSegment!}
                        open={delDialog}
                        setDeldialogue={setDelDialog}
                        handleDeleteSegment={onDeleteSegment}
                    />
                )}
            />
        </PageContent>
    );
};
