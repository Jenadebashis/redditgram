import userReducer from './UserReducer';
import {
  updateBioSuccess,
  clearBioStatus,
  updateProfessionSuccess,
  clearProfessionStatus,
} from '../actions/actions';

describe('userReducer', () => {
  it('should reset bioUpdateStatus to null when clearBioStatus is dispatched', () => {
    const initialState = { bio: '', profession: '', bioUpdateStatus: null, professionUpdateStatus: null, error: null };
    const updated = userReducer(initialState, updateBioSuccess({ bio: 'hello', profession: 'doctor' }));
    expect(updated.bioUpdateStatus).toBe('success');
    const cleared = userReducer(updated, clearBioStatus());
    expect(cleared.bioUpdateStatus).toBeNull();
  });

  it('should handle profession updates', () => {
    const initialState = { bio: '', profession: '', bioUpdateStatus: null, professionUpdateStatus: null, error: null };
    const updated = userReducer(initialState, updateProfessionSuccess({ profession: 'engineer' }));
    expect(updated.profession).toBe('engineer');
    expect(updated.professionUpdateStatus).toBe('success');
    const cleared = userReducer(updated, clearProfessionStatus());
    expect(cleared.professionUpdateStatus).toBeNull();
  });
});
