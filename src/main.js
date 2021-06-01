// Copyright (c) 2021 gkmobin.net@gmail.com. All rights reserved.
// (function (_) {

function isFolder(bookmarkNode) {
	return _.has(bookmarkNode, 'dateGroupModified');
}

function sortBookmarkNode(bookmarkNodeId, sortRules) {
	if (bookmarkNodeId == null)
		return;

	chrome.bookmarks.get(bookmarkNodeId, function (parentNode) {
		// console.log('BookmarkNode: ', parentNode);

		chrome.bookmarks.getChildren(bookmarkNodeId, function (children) {

			//Sort by reverse order
			var sortedChildren = _.sortBy(children, function (bookmarkNode) {
				return _.map(sortRules, rule => rule(bookmarkNode));
			});

			_.each(sortedChildren, function (childBookmarkNode, index) {
				// console.log(childBookmarkNode);
				chrome.bookmarks.move(childBookmarkNode.id, { index: index, parentId: parentNode.id });

				if (isFolder(childBookmarkNode))
					sortBookmarkNode(childBookmarkNode.id, sortRules);
			});
		});
	});
}

function sortBookmarkCurrentFolder(bookmarkManagerTab) {

	if (!isBookmarkManagerTab(bookmarkManagerTab))
		return;

	const url = new URL(bookmarkManagerTab.url);
	const currentBookmarkFolderId = url.searchParams.get('id');

	console.log('CurrentBookmarkFolder', currentBookmarkFolderId);

	if (currentBookmarkFolderId == null)//root
		return;

	optionsProvider.get(options => {
		const sortRules = [];

		const sortedOptions = _.sortBy(options.orderByOptionsSettings, op => op.index );

		_.each(sortedOptions, option => {

			if (option.selected) {
				switch (option.value) {
					case 'Folder':
						sortRules.push(bookmarkNode => isFolder(bookmarkNode) ? 0 : 1);
						break;

					case 'Title':
						sortRules.push(bookmarkNode => bookmarkNode.title);
						break;

					case 'Hostname':
						break;
				}
			}
		});

		//sortRules.reverse();

		console.log('sortBookmarkCurrentFolder: ', currentBookmarkFolderId, options, sortRules);

		sortBookmarkNode(currentBookmarkFolderId, sortRules);
	});

}

function getBookmarkManagerCurrentFolder(bookmarkManagerTab, callback) {
	if (!isBookmarkManagerTab(bookmarkManagerTab))
		return;

	const url = new URL(bookmarkManagerTab.url);
	const currentBookmarkFolderId = url.searchParams.get('id');

	if (currentBookmarkFolderId == null) {//root
		callback(null);
		return;
	}

	chrome.bookmarks.get(currentBookmarkFolderId, function ([folder]) {
		callback(folder);
	});
}

function isBookmarkManagerTab(tab) {
	if (tab && tab.url) {
		const url = new URL(tab.url);
		return url.hostname == 'bookmarks';
	}
	return false;
}

/*
	function sortBookmarks(info, tab) {
		//console.log('callbackHandler: ', info, tab);

		const url = new URL(tab.url);
		console.log('Tab.URL:', url, url.hostname);

		if (url.hostname != 'bookmarks')
			return;

		const currentBookmarkNodeId = url.searchParams.get('id');
		console.log('ContextMenuID', currentBookmarkNodeId);

		if(currentBookmarkNodeId == null)//root
			return;

		sortBookmarkNode(currentBookmarkNodeId);
	}

	function setUpContextMenus() {

		chrome.contextMenus.create({
			title: 'KNET: Sort Bookmarks',
			id: 'bookmarks@knet.com',
			contexts: ['all'],
			documentUrlPatterns: ['chrome://bookmarks/*'],
			onclick: sortBookmarks
		});
	}
*/
	// chrome.runtime.onInstalled.addListener(function (info, tab) {
	// 	setUpContextMenus();
	// 	console.log('KNet:Bookmarks: Initialized');
	// });

// })(_);